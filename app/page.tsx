'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  Headphones,
  MessageCircle,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';

type Channel = 'chat' | 'phone';
type ErrorRow = { id: number; count: number; coefficient: number };

const levels = [
  [0.05, 'Незначна', 'еквівалент оцінки 95'],
  [0.1, 'Помірна', 'еквівалент оцінки 90'],
  [0.2, 'Суттєва', 'еквівалент оцінки 80'],
  [0.7, 'Серйозна', 'еквівалент оцінки 30'],
  [1, 'Критична', 'обнулений діалог'],
  [1.5, 'Критична ×1,5', 'обнулений діалог'],
  [2, 'Критична ×2', 'обнулений діалог'],
] as const;
const number = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const rating = (coefficient: number) =>
  ({ 0.05: 95, 0.1: 90, 0.2: 80, 0.7: 30 })[coefficient] ?? 0;
const inputClass =
  'mt-3 h-14 w-full rounded-xl border border-[#dde0ea] bg-[#fbfbfe] px-4 text-lg font-semibold outline-none transition focus:border-[#6246d8] focus:ring-4 focus:ring-[#e9e5ff]';

export default function Home() {
  const [channel, setChannel] = useState<Channel>('chat');
  const [total, setTotal] = useState(2500);
  const [evaluated, setEvaluated] = useState(10);
  const [errors, setErrors] = useState<ErrorRow[]>([
    { id: 1, count: 1, coefficient: 1 },
  ]);
  const normalizer = channel === 'chat' ? 60 : 30;
  const weighted = useMemo(
    () => errors.reduce((sum, row) => sum + row.count * row.coefficient, 0),
    [errors],
  );
  const rawQuality =
    total > 0 ? (1 - (weighted * normalizer) / total) * 100 : 0;
  const quality = Math.max(0, rawQuality);
  const status =
    quality >= 95
      ? 'Відмінний результат'
      : quality >= 85
        ? 'Є простір для зростання'
        : 'Потрібна увага';
  const update = (id: number, patch: Partial<ErrorRow>) =>
    setErrors((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  const reset = () => {
    setChannel('chat');
    setTotal(2500);
    setEvaluated(10);
    setErrors([{ id: Date.now(), count: 1, coefficient: 1 }]);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-[#17202f]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_15%_10%,rgba(113,88,226,.20),transparent_27%),radial-gradient(circle_at_82%_7%,rgba(24,177,150,.14),transparent_26%)]" />
      <div className="relative mx-auto max-w-[1380px] px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#6246d8] text-white shadow-[0_10px_25px_rgba(98,70,216,.28)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#6246d8]">
                QUALITY DESK
              </p>
              <p className="text-xs text-slate-500">
                Робочий інструмент контролю якості
              </p>
            </div>
          </div>
          <div className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            Оновлено 01.09.2026
          </div>
        </header>
        <section className="mb-7 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[28px] bg-[#17202f] p-7 text-white shadow-[0_24px_50px_rgba(33,33,63,.18)] sm:p-9">
            <div className="mb-7 flex items-center gap-2 text-sm font-medium text-[#b9abff]">
              <Calculator className="size-4" /> Калькулятор показника
            </div>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">
              Оцінка якості,
              <br />
              <span className="text-[#b9abff]">яка говорить цифрами.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Порахуйте показник К з урахуванням каналу комунікації, кількості
              діалогів і ваги кожної помилки.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
                K = (1 − ΣK₁…Kₙ × N / T) × 100
              </span>
              <span className="rounded-full border border-[#b9abff]/30 bg-[#6f57df]/20 px-4 py-2 text-[#d4cdff]">
                Мінімум оцінених: 10
              </span>
            </div>
          </div>
          <aside className="relative overflow-hidden rounded-[28px] border border-[#d9dcf2] bg-white p-7 shadow-[0_16px_36px_rgba(39,48,87,.08)] sm:p-8">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#eef0ff]" />
            <p className="relative text-sm font-semibold text-slate-500">
              Поточний показник К
            </p>
            <div className="relative mt-3 flex items-end gap-3">
              <output className="text-6xl font-semibold tracking-[-.07em] text-[#6246d8] sm:text-7xl">
                {number.format(quality)}
              </output>
              <span className="mb-2 text-2xl font-semibold text-[#6246d8]">
                %
              </span>
            </div>
            <div className="relative mt-6 h-3 overflow-hidden rounded-full bg-[#eceef6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#18b196] to-[#6246d8] transition-all duration-500"
                style={{ width: `${Math.min(quality, 100)}%` }}
              />
            </div>
            <div className="relative mt-5 flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e5f7f3] px-3 py-1.5 text-sm font-semibold text-[#087964]">
                <Check className="size-4" />
                {status}
              </span>
              <span className="text-sm text-slate-500">
                Втрата:{' '}
                <b className="text-slate-800">
                  {number.format(100 - quality)}%
                </b>
              </span>
            </div>
          </aside>
        </section>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="rounded-[28px] border border-[#e1e3ef] bg-white p-5 shadow-[0_16px_36px_rgba(39,48,87,.06)] sm:p-7">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.13em] text-[#6246d8]">
                  Крок 1 · дані періоду
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-.03em]">
                  Налаштуйте розрахунок
                </h2>
              </div>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <RefreshCcw className="size-4" />
                Скинути
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">
                  Канал комунікації
                </legend>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f5f6fb] p-1.5">
                  {(
                    [
                      ['chat', MessageCircle, 'Чати', 'N = 60'],
                      ['phone', Headphones, 'Телефонія', 'N = 30'],
                    ] as const
                  ).map(([value, Icon, label, note]) => (
                    <button
                      key={value}
                      onClick={() => setChannel(value)}
                      className={`flex flex-col items-start gap-2 rounded-xl p-4 text-left transition ${channel === value ? 'bg-white text-[#6246d8] shadow-sm ring-1 ring-[#dfdcf5]' : 'text-slate-500 hover:bg-white/60'}`}
                    >
                      <Icon className="size-5" />
                      <span className="font-semibold">{label}</span>
                      <span className="text-xs opacity-75">{note}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">
                  Проведено (T)
                  <input
                    value={total || ''}
                    min="0"
                    onChange={(e) =>
                      setTotal(Math.max(0, Number(e.target.value)))
                    }
                    type="number"
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-semibold">
                  Оцінено
                  <input
                    value={evaluated || ''}
                    min="0"
                    onChange={(e) =>
                      setEvaluated(Math.max(0, Number(e.target.value)))
                    }
                    type="number"
                    className={inputClass}
                  />
                </label>
                <p className="col-span-2 -mt-1 text-xs leading-relaxed text-slate-500">
                  Кількість оцінених діалогів показана для контролю. У формулі
                  використовується сума помилок.
                </p>
              </div>
            </div>
            <div className="mt-9 border-t border-[#edf0f5] pt-7">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.13em] text-[#6246d8]">
                    Крок 2 · помилки
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-.03em]">
                    Вага помилок
                  </h2>
                </div>
                <button
                  onClick={() =>
                    setErrors((rows) => [
                      ...rows,
                      { id: Date.now(), count: 1, coefficient: 0.05 },
                    ])
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6246d8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(98,70,216,.22)] transition hover:bg-[#5138c4]"
                >
                  <Plus className="size-4" />
                  Додати
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-[#e4e6ef]">
                <div className="hidden grid-cols-[minmax(240px,1fr)_110px_88px_40px] gap-3 bg-[#f7f8fc] px-4 py-2.5 text-xs font-bold uppercase tracking-[.1em] text-slate-500 sm:grid">
                  <span>Рівень</span>
                  <span>Коефіцієнт</span>
                  <span>Кількість</span>
                  <span />
                </div>
                {errors.map((row) => {
                  const level =
                    levels.find((level) => level[0] === row.coefficient) ??
                    levels[0];
                  return (
                    <div
                      key={row.id}
                      className="grid gap-2.5 border-t border-[#edf0f5] p-3 sm:grid-cols-[minmax(240px,1fr)_110px_88px_40px] sm:items-center"
                    >
                      <label className="relative block">
                        <span className="mb-1 block text-xs font-semibold text-slate-500 sm:hidden">
                          Рівень помилки
                        </span>
                        <select
                          aria-label="Рівень помилки"
                          value={row.coefficient}
                          onChange={(e) =>
                            update(row.id, {
                              coefficient: Number(e.target.value),
                            })
                          }
                          className="h-10 w-full appearance-none rounded-xl border border-[#dde0ea] bg-[#fbfbfe] px-3 pr-9 text-sm font-semibold outline-none focus:border-[#6246d8]"
                        >
                          {levels.map(([value, label]) => (
                            <option key={value} value={value}>
                              {label} · оцінка {rating(value)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-8 size-4 text-slate-400 sm:top-3" />
                        <span className="mt-1 block text-xs leading-tight text-slate-500">
                          {level[1]} · {level[2]}
                        </span>
                      </label>
                      <div className="rounded-xl bg-[#f5f3ff] px-3 py-2.5 text-sm font-semibold text-[#6246d8]">
                        <span className="mr-1 text-xs text-slate-500 sm:hidden">
                          Коефіцієнт:{' '}
                        </span>
                        {level[0].toFixed(2).replace('.', ',')}
                      </div>
                      <label>
                        <span className="mb-1 block text-xs font-semibold text-slate-500 sm:hidden">
                          Кількість
                        </span>
                        <input
                          aria-label="Кількість помилок"
                          value={row.count || ''}
                          min="0"
                          onChange={(e) =>
                            update(row.id, {
                              count: Math.max(0, Number(e.target.value)),
                            })
                          }
                          type="number"
                          className="h-10 w-full rounded-xl border border-[#dde0ea] bg-[#fbfbfe] px-3 text-sm font-semibold outline-none focus:border-[#6246d8]"
                        />
                      </label>
                      <button
                        onClick={() =>
                          setErrors((rows) =>
                            rows.length > 1
                              ? rows.filter((item) => item.id !== row.id)
                              : [
                                  {
                                    id: Date.now(),
                                    count: 0,
                                    coefficient: 0.05,
                                  },
                                ],
                          )
                        }
                        aria-label="Видалити помилку"
                        className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f5f6fb] px-4 py-3 text-sm">
                <span className="text-slate-500">
                  Σ помилок з коефіцієнтами
                </span>
                <b className="text-lg text-[#17202f]">
                  {number.format(weighted)}
                </b>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-[28px] bg-[#6250c7] p-6 text-white shadow-[0_16px_36px_rgba(98,70,216,.22)]">
              <p className="text-sm font-semibold text-[#d8d0ff]">
                Розрахунок зараз
              </p>
              <div className="mt-5 rounded-2xl bg-white/10 p-4 font-mono text-sm leading-loose text-white/90">
                (1 − ({number.format(weighted)} × {normalizer}) /{' '}
                {number.format(total)}) × 100
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                <span className="text-sm text-[#d8d0ff]">Ваш показник</span>
                <span className="text-3xl font-semibold">
                  {number.format(quality)}%
                </span>
              </div>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(
                    `Показник якості: ${number.format(quality)}%`,
                  )
                }
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#503bb9] transition hover:bg-[#f4f1ff]"
              >
                <Copy className="size-4" />
                Скопіювати результат
              </button>
            </div>
            <div className="rounded-[28px] border border-[#e1e3ef] bg-white p-6 shadow-[0_16px_36px_rgba(39,48,87,.06)]">
              <div className="flex items-center gap-2">
                <CircleHelp className="size-5 text-[#6246d8]" />
                <h2 className="font-semibold">Як це працює</h2>
              </div>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  <b className="text-slate-800">N</b> — нормуючий коефіцієнт: 60
                  для чатів і 30 для телефонії.
                </p>
                <p>
                  <b className="text-slate-800">T</b> — усі проведені
                  комунікації за період.
                </p>
                <p>
                  <b className="text-slate-800">K₁…Kₙ</b> — кожна помилка,
                  помножена на її коефіцієнт.
                </p>
              </div>
              <div className="mt-5 flex gap-2 rounded-2xl bg-[#fff8e6] p-3 text-xs leading-relaxed text-[#725b19]">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                Діалоги, оцінені 29–31 числа, враховуються у показнику
                наступного місяця.
              </div>
            </div>
          </aside>
        </section>
        <footer className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-500">
          Контроль якості починається з прозорих даних{' '}
          <ArrowRight className="size-4" />
        </footer>
      </div>
    </main>
  );
}
