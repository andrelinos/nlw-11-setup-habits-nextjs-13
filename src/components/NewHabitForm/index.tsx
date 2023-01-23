import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';

import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';

import { api } from '~/lib/axios';

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
];

export function NewHabitForm() {
    const [title, setTitle] = useState('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    const token = Cookie.get('token');

    async function createNewHabit(event: FormEvent) {
        event.preventDefault();

        if (!title || weekDays.length === 0) {
            toast.warning(
                'Informe o comprometimento e selecione pelo menos um dia para continuar',
            );
            return;
        }

        try {
            await api.post('habits', {
                title,
                weekDays,
            });

            setTitle('');
            setWeekDays([]);

            toast.success('Hábito criado com sucesso!');
        } catch {
            toast.error('Ocorreu um erro ao criar hábito!');
        }
    }

    function handleToggleWeekDay(weekDay: number) {
        if (weekDays.includes(weekDay)) {
            const weekDaysWithRemovedOne = weekDays.filter(
                (day) => day !== weekDay,
            );
            setWeekDays(weekDaysWithRemovedOne);
        } else {
            const weekDaysWithAddedOne = [...weekDays, weekDay];
            setWeekDays(weekDaysWithAddedOne);
        }
    }

    return (
        <form
            onSubmit={createNewHabit}
            className="w-full scroll-py-64 flex flex-col mt-6"
        >
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input
                type="text"
                id="title"
                placeholder="ex.: Exercícios, dormir bem, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400
          focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2
        focus:ring-offset-zinc-900"
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>

            {/* <div className="flex flex-col gap-3 mt-3"> */}
            <div className="grid grid-cols-2 gap-3 mt-3">
                {availableWeekDays.map((weekDay, index) => (
                    <Checkbox.Root
                        key={weekDay}
                        className="flex items-center gap-3 group focus:outline-none"
                        checked={weekDays.includes(index)}
                        onCheckedChange={() => handleToggleWeekDay(index)}
                    >
                        <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center
              bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500
              group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2
              group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background"
                        >
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white" />
                            </Checkbox.Indicator>
                        </div>

                        <span className="text-white leading-tight">
                            {weekDay}
                        </span>
                    </Checkbox.Root>
                ))}
            </div>

            {token ? (
                <button
                    type="submit"
                    className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold
        bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2
        focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    <Check size={20} weight="bold" />
                    Confirmar
                </button>
            ) : (
                <button
                    className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold
                    bg-gray-400 hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2
                    focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900 opacity-30 disabled:hover:cursor-not-allowed"
                    disabled
                >
                    <Check size={20} weight="bold" />
                    Confirmar
                </button>
            )}
        </form>
    );
}
