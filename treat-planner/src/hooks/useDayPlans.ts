import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { DayPlan, DayPlanFormData, Member } from '@/types';

export function useDayPlans(userId: string | undefined) {
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setDayPlans([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'dayPlans'),
      where('ownerId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const plans: DayPlan[] = [];
        snapshot.forEach((doc) => {
          plans.push({ id: doc.id, ...doc.data() } as DayPlan);
        });
        setDayPlans(plans);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching day plans:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const createDayPlan = async (data: DayPlanFormData, userId: string, userEmail: string) => {
    // Parse members from comma-separated list
    const members: Member[] = data.membersList
      ? data.membersList.split(',').map((m) => {
          const trimmed = m.trim();
          const emailRegex = /\S+@\S+\.\S+/;
          if (emailRegex.test(trimmed)) {
            return { name: trimmed.split('@')[0], email: trimmed };
          }
          return { name: trimmed };
        })
      : [];

    const newPlan = {
      ownerId: userId,
      ownerEmail: userEmail,
      title: data.title,
      date: Timestamp.fromDate(data.date),
      description: data.description || '',
      members,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'dayPlans'), newPlan);
    return docRef.id;
  };

  const updateDayPlan = async (planId: string, data: Partial<DayPlanFormData>) => {
    const planRef = doc(db, 'dayPlans', planId);
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (data.title) updateData.title = data.title;
    if (data.date) updateData.date = Timestamp.fromDate(data.date);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.membersList !== undefined) {
      updateData.members = data.membersList.split(',').map((m) => {
        const trimmed = m.trim();
        const emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(trimmed)) {
          return { name: trimmed.split('@')[0], email: trimmed };
        }
        return { name: trimmed };
      });
    }

    await updateDoc(planRef, updateData);
  };

  return { dayPlans, loading, error, createDayPlan, updateDayPlan };
}

