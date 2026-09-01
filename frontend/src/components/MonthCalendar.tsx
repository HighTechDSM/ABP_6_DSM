import { useMemo, useState } from 'react'
import Icon from './Icon'

type SelectionMode = 'single' | 'range'

interface MonthCalendarProps {
  compact?: boolean
  selectionMode?: SelectionMode
  selectedDate?: string
  rangeStart?: string
  rangeEnd?: string
  onDateChange?: (date: string) => void
  onRangeChange?: (startDate: string, endDate: string) => void
}

const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDateValue(value?: string) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatFullDate(value?: string) {
  const date = fromDateValue(value)
  return date?.toLocaleDateString('pt-BR') ?? ''
}

function MonthCalendar({
  compact = false,
  selectionMode = 'single',
  selectedDate,
  rangeStart,
  rangeEnd,
  onDateChange,
  onRangeChange,
}: MonthCalendarProps) {
  const initialDate = fromDateValue(selectedDate || rangeStart) ?? new Date()
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    const gridStart = new Date(firstDay)
    gridStart.setDate(firstDay.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart)
      date.setDate(gridStart.getDate() + index)
      return date
    })
  }, [visibleMonth])

  const today = toDateValue(new Date())
  const monthLabel = visibleMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  function changeMonth(offset: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  function goToToday() {
    const currentDate = new Date()
    setVisibleMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  }

  function selectDay(value: string) {
    if (selectionMode === 'single') {
      onDateChange?.(value)
      return
    }

    if (!rangeStart || rangeEnd) {
      onRangeChange?.(value, '')
      return
    }

    if (value < rangeStart) {
      onRangeChange?.(value, rangeStart)
      return
    }

    onRangeChange?.(rangeStart, value)
  }

  return (
    <div className={`month-calendar${compact ? ' month-calendar--compact' : ''}`}>
      <div className="month-calendar__toolbar">
        <div>
          <span className="month-calendar__label">Mês exibido</span>
          <strong>{monthLabel}</strong>
        </div>
        <div className="month-calendar__controls">
          <button className="month-calendar__today" type="button" onClick={goToToday}>Hoje</button>
          <button className="month-calendar__nav" type="button" aria-label="Mês anterior" onClick={() => changeMonth(-1)}><Icon name="chevron-left" size={18} /></button>
          <button className="month-calendar__nav" type="button" aria-label="Próximo mês" onClick={() => changeMonth(1)}><Icon name="chevron-right" size={18} /></button>
        </div>
      </div>

      <div className="month-calendar__grid" role="grid" aria-label={`Calendário de ${monthLabel}`}>
        {weekdayLabels.map((weekday) => <span className="month-calendar__weekday" role="columnheader" key={weekday}>{weekday}</span>)}
        {calendarDays.map((date) => {
          const value = toDateValue(date)
          const isOutsideMonth = date.getMonth() !== visibleMonth.getMonth()
          const isSelected = selectionMode === 'single' && value === selectedDate
          const isRangeStart = selectionMode === 'range' && value === rangeStart
          const isRangeEnd = selectionMode === 'range' && value === rangeEnd
          const isInRange = selectionMode === 'range' && Boolean(rangeStart && rangeEnd && value > rangeStart && value < rangeEnd)
          const classNames = [
            'month-calendar__day',
            isOutsideMonth ? 'month-calendar__day--outside' : '',
            value === today ? 'month-calendar__day--today' : '',
            isSelected ? 'month-calendar__day--selected' : '',
            isRangeStart ? 'month-calendar__day--range-start' : '',
            isRangeEnd ? 'month-calendar__day--range-end' : '',
            isInRange ? 'month-calendar__day--in-range' : '',
          ].filter(Boolean).join(' ')

          return (
            <button
              aria-label={date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              aria-pressed={isSelected || isRangeStart || isRangeEnd}
              className={classNames}
              key={value}
              onClick={() => selectDay(value)}
              role="gridcell"
              type="button"
            >
              <span>{date.getDate()}</span>
              {value === today && <small>Hoje</small>}
            </button>
          )
        })}
      </div>

      <div className="month-calendar__footer" aria-live="polite">
        {selectionMode === 'single' && (selectedDate
          ? <>Data selecionada: <strong>{formatFullDate(selectedDate)}</strong></>
          : 'Selecione um dia para consultar os agendamentos.')}
        {selectionMode === 'range' && (!rangeStart
          ? 'Selecione a data inicial do período.'
          : rangeEnd
            ? <>Período selecionado: <strong>{formatFullDate(rangeStart)} a {formatFullDate(rangeEnd)}</strong></>
            : <>Início selecionado: <strong>{formatFullDate(rangeStart)}</strong>. Agora escolha a data final.</>)}
      </div>
    </div>
  )
}

export default MonthCalendar
