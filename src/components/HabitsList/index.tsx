import { useEffect, useState } from 'react';

import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';

import { Loading } from '../Loading';

interface HabitLisProps {
    date: Date;
    onCompletedChanged: (completed: number, amount: number) => void;
}

interface HabitsInfo {
    possibleHabits: {
        id: string;
        title: string;
        created_at: string;
    }[];
    completedHabits: string[];
}

export function HabitsList({ date, onCompletedChanged }: HabitLisProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

    async function handleToggleHabit(habitId: string) {
        try {
            const baseUrl = process?.env?.BASE_URL || '';
            if (habitId && habitsInfo) {
                const isHabitAlreadyCompleted =
                    habitsInfo.completedHabits.includes(habitId);

                await fetch(`${baseUrl}/api/habits/${habitId}/toggle`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        return data;
                    });

                let completedHabits: string[] = [];

                if (isHabitAlreadyCompleted) {
                    completedHabits = habitsInfo.completedHabits.filter(
                        (id) => id !== habitId,
                    );
                } else {
                    completedHabits = [...habitsInfo.completedHabits, habitId];
                }

                setHabitsInfo({
                    possibleHabits: habitsInfo.possibleHabits,
                    completedHabits,
                });

                onCompletedChanged(
                    completedHabits.length,
                    habitsInfo.possibleHabits.length,
                );
            }
        } catch (error) {
            return;
        }
    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());

    useEffect(() => {
        setIsLoading(true);
        const baseUrl = process?.env?.BASE_URL || '';

        const dateQuery = date.toISOString();
        try {
            fetch(`${baseUrl}/api/day?date=${dateQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setHabitsInfo(data);
                })
                .catch((error) => console.error('erro habits id \n', error));
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    return (
        <div className="mt-6 flex flex-col gap-3">
            {isLoading || habitsInfo === undefined ? (
                <Loading />
            ) : (
                habitsInfo?.possibleHabits?.map((habit) => {
                    return (
                        <Checkbox.Root
                            key={habit.id}
                            onCheckedChange={() => handleToggleHabit(habit.id)}
                            checked={habitsInfo?.completedHabits?.includes(
                                habit.id,
                            )}
                            disabled={isDateInPast}
                            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
                        >
                            <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 
                                border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 
                                transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 
                                group-focus:ring-offset-background"
                            >
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white" />
                                </Checkbox.Indicator>
                            </div>

                            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                                {habit.title}
                            </span>
                        </Checkbox.Root>
                    );
                })
            )}
        </div>
    );
}
