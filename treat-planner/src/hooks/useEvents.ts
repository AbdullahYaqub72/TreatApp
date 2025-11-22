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
import type { Event, EventFormData, DayPlan } from '@/types';

export function useEvents(dayPlanId: string | undefined) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!dayPlanId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'events'),
      where('dayPlanId', '==', dayPlanId),
      orderBy('dateTime', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsList: Event[] = [];
        snapshot.forEach((doc) => {
          eventsList.push({ id: doc.id, ...doc.data() } as Event);
        });
        setEvents(eventsList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching events:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dayPlanId]);

  const createEvent = async (data: EventFormData, dayPlanId: string, ownerId: string, ownerEmail: string) => {
    const newEvent = {
      dayPlanId,
      ownerId,
      ownerEmail,
      title: data.title,
      type: data.type,
      dateTime: Timestamp.fromDate(data.dateTime),
      location: data.location || '',
      locationUrl: data.locationUrl || '',
      notes: data.notes || '',
      totalBill: data.totalBill || 0,
      payer: data.payer || '',
      payerEmail: data.payerEmail || '',
      payerAccountDetails: data.payerAccountDetails || '',
      attendees: data.selectedMembers,
      rsvps: {} as Record<string, 'yes' | 'no' | 'maybe'>,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    return docRef.id;
  };

  const updateEvent = async (eventId: string, data: Partial<EventFormData>) => {
    const eventRef = doc(db, 'events', eventId);
    const updateData: any = {
      updatedAt: serverTimestamp(),
    };

    if (data.title) updateData.title = data.title;
    if (data.type) updateData.type = data.type;
    if (data.dateTime) updateData.dateTime = Timestamp.fromDate(data.dateTime);
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.totalBill !== undefined) updateData.totalBill = data.totalBill;
    if (data.payer !== undefined) updateData.payer = data.payer;
    if (data.selectedMembers) updateData.attendees = data.selectedMembers;

    await updateDoc(eventRef, updateData);
  };

  const updateRSVP = async (eventId: string, memberId: string, status: 'yes' | 'no' | 'maybe') => {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      [`rsvps.${memberId}`]: status,
      updatedAt: serverTimestamp(),
    });
  };

  const updateBill = async (eventId: string, totalBill: number) => {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      totalBill,
      updatedAt: serverTimestamp(),
    });
  };

  return { events, loading, error, createEvent, updateEvent, updateRSVP, updateBill };
}

export function useDayPlan(planId: string | undefined) {
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      setDayPlan(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'dayPlans', planId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setDayPlan({ id: snapshot.id, ...snapshot.data() } as DayPlan);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [planId]);

  return { dayPlan, loading };
}

