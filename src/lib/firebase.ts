import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  onSnapshot, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  or,
  and
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { FamilyProfile, CommunityCircle, FAQItem, HopeReminder } from "../types";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with specific database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Direct Chat Message Interface
export interface DirectMessage {
  id?: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  text: string;
  createdAt: any;
  timestampStr?: string;
}

// Circle Message Interface
export interface CircleMessageDoc {
  id?: string;
  circleId: string;
  sender: string;
  avatar: string;
  text: string;
  createdAt: any;
  timeStr: string;
}

// Custom Local Auth User Interface (Fallback when Auth Provider is disabled in Firebase Console)
export interface CustomAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isCustomSession?: boolean;
}

const CUSTOM_SESSION_KEY = "sukoon_custom_auth_user";

// Event listener set for instant reactive auth updates without page refresh
const authListeners = new Set<(user: CustomAuthUser | null) => void>();

function notifyAuthListeners(user: CustomAuthUser | null) {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error("Auth listener error:", e);
    }
  });
}

export function getStoredCustomUser(): CustomAuthUser | null {
  try {
    const raw = localStorage.getItem(CUSTOM_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read stored custom user", e);
  }
  return null;
}

export function setStoredCustomUser(user: CustomAuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(CUSTOM_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CUSTOM_SESSION_KEY);
    }
    notifyAuthListeners(user);
  } catch (e) {
    console.error("Failed to set stored custom user", e);
  }
}

export function emailToUid(email: string): string {
  return "usr_" + email.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
}

/**
 * Register a new user with Email & Password.
 * Automatically saves user profile and notifies listeners immediately without page refresh.
 */
export async function registerWithEmail(
  email: string, 
  pass: string, 
  initialProfile: Omit<FamilyProfile, "id">
): Promise<{ uid: string; email: string; displayName: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    const isAdam = email.toLowerCase().includes("adam") || (initialProfile.parentName && initialProfile.parentName.toLowerCase().includes("adam"));
    const userRole: "admin" | "user" = isAdam ? "admin" : "user";

    const userProfile: FamilyProfile & { password?: string } = {
      ...initialProfile,
      id: user.uid,
      email: email.toLowerCase().trim(),
      role: userRole,
      password: pass
    };

    await setDoc(doc(db, "users", user.uid), userProfile, { merge: true });
    
    const customUser: CustomAuthUser = {
      uid: user.uid,
      email: user.email || email,
      displayName: initialProfile.parentName
    };
    setStoredCustomUser(customUser);

    return { uid: user.uid, email: user.email || email, displayName: initialProfile.parentName };
  } catch (error: any) {
    if (error.code === "auth/operation-not-allowed" || error.message?.includes("operation-not-allowed")) {
      console.warn("Firebase Email/Password Auth disabled in console. Created instant Firestore Database user account.");
      
      const isAdam = email.toLowerCase().includes("adam") || (initialProfile.parentName && initialProfile.parentName.toLowerCase().includes("adam"));
      const userRole: "admin" | "user" = isAdam ? "admin" : "user";

      const customUid = emailToUid(email);
      const customUser: CustomAuthUser = {
        uid: customUid,
        email: email,
        displayName: initialProfile.parentName,
        isCustomSession: true
      };

      const userProfile: FamilyProfile & { password?: string } = {
        ...initialProfile,
        id: customUid,
        email: email.toLowerCase().trim(),
        role: userRole,
        password: pass
      };

      // Save to Firestore database and local session
      await setDoc(doc(db, "users", customUid), userProfile, { merge: true });
      setStoredCustomUser(customUser);

      return { uid: customUid, email: email, displayName: initialProfile.parentName };
    }
    throw error;
  }
}

/**
 * Login existing user with Email & Password.
 */
export async function loginWithEmail(
  email: string, 
  pass: string
): Promise<{ uid: string; email: string; displayName: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    const user = userCredential.user;
    
    const customUser: CustomAuthUser = {
      uid: user.uid,
      email: user.email || normalizedEmail,
      displayName: user.displayName || normalizedEmail.split("@")[0]
    };
    setStoredCustomUser(customUser);

    return { uid: user.uid, email: user.email || normalizedEmail, displayName: user.displayName || "" };
  } catch (error: any) {
    if (error.code === "auth/operation-not-allowed" || error.message?.includes("operation-not-allowed")) {
      console.warn("Firebase Email/Password Auth disabled in console. Using Database Account verification.");
      
      const customUid = emailToUid(normalizedEmail);
      const userDocRef = doc(db, "users", customUid);
      const userDocSnap = await getDoc(userDocRef);

      let foundData: any = null;
      if (userDocSnap.exists()) {
        foundData = userDocSnap.data();
      } else {
        const q = query(collection(db, "users"), where("email", "==", normalizedEmail));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          foundData = querySnap.docs[0].data();
        }
      }

      if (!foundData) {
        throw new Error("Account not found. Please verify your email or sign up first.");
      }

      if (foundData.password && foundData.password !== pass) {
        throw new Error("Incorrect password. Please make sure your email and password are both exactly correct.");
      }

      // If missing password in legacy document, set it on login
      if (!foundData.password) {
        await setDoc(userDocRef, { password: pass }, { merge: true });
      }

      const customUser: CustomAuthUser = {
        uid: foundData.id || customUid,
        email: normalizedEmail,
        displayName: foundData.parentName || normalizedEmail.split("@")[0],
        isCustomSession: true
      };

      setStoredCustomUser(customUser);
      return { uid: customUser.uid, email: normalizedEmail, displayName: customUser.displayName || "" };
    }
    throw error;
  }
}

/**
 * Quick Guest / Demo Login.
 */
export async function loginAnonymouslyUser(): Promise<{ uid: string; email: string; displayName: string }> {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    const customUser: CustomAuthUser = {
      uid: user.uid,
      email: "guest@sukoon.app",
      displayName: "Guest Member"
    };
    setStoredCustomUser(customUser);
    return { uid: user.uid, email: "guest@sukoon.app", displayName: "Guest Member" };
  } catch (error: any) {
    const customUid = "guest_" + Math.random().toString(36).substring(2, 10);
    const customUser: CustomAuthUser = {
      uid: customUid,
      email: "guest@sukoon.app",
      displayName: "Guest Member",
      isCustomSession: true
    };
    setStoredCustomUser(customUser);
    return { uid: customUid, email: "guest@sukoon.app", displayName: "Guest Member" };
  }
}

/**
 * Logout user.
 */
export async function logoutUser(): Promise<void> {
  setStoredCustomUser(null);
  try {
    await signOut(auth);
  } catch (e) {
    // Ignore signout error for custom session
  }
}

/**
 * Listen for Auth state changes reactively.
 */
export function onAuthChange(callback: (user: CustomAuthUser | null) => void) {
  authListeners.add(callback);

  // Immediately invoke with stored state if present
  const customUser = getStoredCustomUser();
  callback(customUser);

  const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const u: CustomAuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      };
      callback(u);
    } else {
      const stored = getStoredCustomUser();
      callback(stored);
    }
  });

  return () => {
    authListeners.delete(callback);
    unsubscribeFirebase();
  };
}

/**
 * Save / Update User Profile in Firestore.
 */
export async function saveUserProfileToFirestore(profile: FamilyProfile): Promise<void> {
  if (!profile.id) return;
  await setDoc(doc(db, "users", profile.id), profile, { merge: true });
}

/**
 * Fetch User Profile from Firestore.
 */
export async function fetchUserProfileFromFirestore(uid: string, email?: string): Promise<FamilyProfile | null> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FamilyProfile;
    }

    if (email) {
      const emailUid = emailToUid(email);
      const emailDocRef = doc(db, "users", emailUid);
      const emailDocSnap = await getDoc(emailDocRef);
      if (emailDocSnap.exists()) {
        return emailDocSnap.data() as FamilyProfile;
      }

      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        return querySnap.docs[0].data() as FamilyProfile;
      }
    }
  } catch (error) {
    console.error("Error fetching profile from Firestore:", error);
  }
  return null;
}

/**
 * Real-time subscription to all registered user profiles in Firestore
 */
export function subscribeToUserProfilesFromFirestore(callback: (profiles: FamilyProfile[]) => void) {
  const q = collection(db, "users");
  return onSnapshot(
    q,
    (snapshot) => {
      const profiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as FamilyProfile[];
      callback(profiles);
    },
    (error) => {
      console.error("Error subscribing to users in Firestore:", error);
    }
  );
}

/**
 * Subscribe to direct messages between current user and another family in real-time.
 */
export function subscribeToDirectMessages(
  userId1: string,
  userId2: string,
  callback: (messages: DirectMessage[]) => void
) {
  if (!userId1 || !userId2) return () => {};

  const q = query(
    collection(db, "direct_messages"),
    or(
      and(where("senderId", "==", userId1), where("recipientId", "==", userId2)),
      and(where("senderId", "==", userId2), where("recipientId", "==", userId1))
    ),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: DirectMessage[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as DirectMessage[];
      callback(msgs);
    },
    (error) => {
      console.error("Error listening to direct messages:", error);
      const fallbackQuery = query(collection(db, "direct_messages"), orderBy("createdAt", "asc"));
      return onSnapshot(fallbackQuery, (snap) => {
        const allMsgs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DirectMessage[];
        const filtered = allMsgs.filter(
          (m) =>
            (m.senderId === userId1 && m.recipientId === userId2) ||
            (m.senderId === userId2 && m.recipientId === userId1)
        );
        callback(filtered);
      });
    }
  );
}

/**
 * Send a direct message to another family and store in Firestore.
 */
export async function sendDirectMessageToFirestore(
  senderId: string,
  recipientId: string,
  senderName: string,
  text: string
): Promise<void> {
  if (!senderId || !recipientId || !text.trim()) return;

  const now = new Date();
  const timestampStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  await addDoc(collection(db, "direct_messages"), {
    senderId,
    recipientId,
    senderName,
    text: text.trim(),
    createdAt: serverTimestamp(),
    timestampStr
  });
}

/**
 * Subscribe to all real-time incoming messages for a recipient user to show instant alert notifications.
 */
export function subscribeToAllIncomingDirectMessages(
  recipientUserId: string,
  onNewMessage: (msg: DirectMessage) => void
) {
  if (!recipientUserId) return () => {};

  const seenMsgIds = new Set<string>();
  let isInitialLoad = true;

  const q = query(
    collection(db, "direct_messages"),
    where("recipientId", "==", recipientUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (isInitialLoad) {
        snapshot.docs.forEach((d) => seenMsgIds.add(d.id));
        isInitialLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const docId = change.doc.id;
          if (!seenMsgIds.has(docId)) {
            seenMsgIds.add(docId);
            const data = change.doc.data() as DirectMessage;
            if (data.senderId !== recipientUserId) {
              onNewMessage({ id: docId, ...data });
            }
          }
        }
      });
    },
    (error) => {
      console.error("Error subscribing to incoming direct messages:", error);
    }
  );
}

/**
 * Subscribe to real-time Community Circles from Firestore.
 */
export function subscribeToCommunityCirclesFromFirestore(
  callback: (circles: CommunityCircle[]) => void
) {
  const q = query(collection(db, "community_circles"));

  return onSnapshot(
    q,
    (snapshot) => {
      const circles = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "Community Circle",
          category: data.category || "General",
          description: data.description || "",
          memberCount: data.memberCount || 1,
          isJoined: false,
          iconName: data.iconName || "Users",
          pinnedTip: data.pinnedTip || "Sharing support and care guidance.",
          recentMessages: data.recentMessages || [],
          meetingSchedule: data.meetingSchedule || "Weekly online meetups",
          tags: data.tags || ["community"]
        } as CommunityCircle;
      });
      callback(circles);
    },
    (error) => {
      console.error("Error subscribing to community circles:", error);
    }
  );
}

/**
 * Create a new Community Circle record in Firestore.
 */
export async function createCommunityCircleInFirestore(circleData: {
  title: string;
  category: string;
  description: string;
  pinnedTip: string;
  meetingSchedule: string;
  tags: string[];
  creatorName: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "community_circles"), {
    ...circleData,
    memberCount: 1,
    iconName: "Users",
    createdAt: serverTimestamp(),
    recentMessages: [
      {
        sender: circleData.creatorName || "Circle Founder",
        time: "Just now",
        text: `Assalamu Alaikum! Welcome to the new ${circleData.title} circle. Feel free to leave a post or question below!`,
        avatar: (circleData.creatorName || "C").charAt(0).toUpperCase()
      }
    ]
  });
  return docRef.id;
}

/**
 * Delete a Community Circle record in Firestore.
 */
export async function deleteCommunityCircleInFirestore(circleId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "community_circles", circleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting community circle from Firestore:", error);
    return false;
  }
}

/**
 * Subscribe to community circle real-time messages.
 */
export function subscribeToCircleMessages(
  circleId: string,
  callback: (messages: CircleMessageDoc[]) => void
) {
  const q = query(
    collection(db, "circle_messages"),
    where("circleId", "==", circleId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as CircleMessageDoc[];
      callback(msgs);
    },
    (err) => {
      console.error("Error subscribing to circle messages:", err);
      const fallbackQ = query(collection(db, "circle_messages"));
      return onSnapshot(fallbackQ, (snap) => {
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CircleMessageDoc[];
        const filtered = all
          .filter((m) => m.circleId === circleId)
          .sort((a, b) => ((a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)));
        callback(filtered);
      });
    }
  );
}

/**
 * Send a message in a community circle.
 */
export async function sendCircleMessageToFirestore(
  circleId: string,
  senderName: string,
  avatar: string,
  text: string
): Promise<void> {
  if (!circleId || !text.trim()) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  await addDoc(collection(db, "circle_messages"), {
    circleId,
    sender: senderName,
    avatar: avatar || senderName.charAt(0).toUpperCase() || "F",
    text: text.trim(),
    createdAt: serverTimestamp(),
    timeStr
  });
}

/**
 * Subscribe to real-time Fiqh Records from Firestore.
 */
export function subscribeToFiqhRecordsFromFirestore(
  callback: (records: FAQItem[]) => void
) {
  const q = query(collection(db, "community_fiqh_records"));
  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          category: data.category || "General",
          question: data.question || "",
          answer: data.answer || "",
          keyTakeaway: data.keyTakeaway || "",
          scholarlyBasis: data.scholarlyBasis || "",
          tags: data.tags || ["guidance"],
          helpfulCount: data.helpfulCount || 0
        } as FAQItem;
      });
      callback(records);
    },
    (err) => {
      console.error("Error subscribing to fiqh records:", err);
    }
  );
}

/**
 * Create a new Fiqh Record in Firestore.
 */
export async function createFiqhRecordInFirestore(record: {
  category: string;
  question: string;
  answer: string;
  keyTakeaway: string;
  scholarlyBasis: string;
  tags: string[];
}): Promise<string> {
  const docRef = await addDoc(collection(db, "community_fiqh_records"), {
    ...record,
    helpfulCount: 0,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * Subscribe to real-time Hope Reminders from Firestore.
 */
export function subscribeToHopeRemindersFromFirestore(
  callback: (reminders: HopeReminder[]) => void
) {
  const q = query(collection(db, "community_hope_reminders"));
  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || "Quran",
          source: data.source || "",
          arabicText: data.arabicText || "",
          translation: data.translation || "",
          context: data.context || "",
          isBookmarked: false
        } as HopeReminder;
      });
      callback(records);
    },
    (err) => {
      console.error("Error subscribing to hope reminders:", err);
    }
  );
}

/**
 * Create a new Hope Reminder record in Firestore.
 */
export async function createHopeReminderInFirestore(reminder: {
  type: "Quran" | "Hadith" | "Scholar Reflection";
  source: string;
  arabicText?: string;
  translation: string;
  context: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "community_hope_reminders"), {
    ...reminder,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
