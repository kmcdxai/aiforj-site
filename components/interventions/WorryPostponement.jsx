"use client";

import { useState, useCallback } from 'react';

const DYNAMIC_PROMPTS = [
  'Any more?',
  'What else is on your mind?',
  'Anything lurking in the background?',
  'Even the small ones count.',
  'What about work? Relationships? Health?',
];

const TIME_SLOTS = [
  { id: 'today-morning', label: 'Today Morning' },
  { id: 'today-afternoon', label: 'Today Afternoon' },
  { id: 'today-evening', label: 'Today Evening' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'this-week', label: 'This Week' },
];

export default function WorryPostponement({ onComplete }) {
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  // Step 2: Brain Dump
  const [worries, setWorries] = useState([]);
  const [currentWorry, setCurrentWorry] = useState('');

  // Step 3: Sort
  const [sortedWorries, setSortedWorries] = useState({});
  // { [worry]: 'action' | 'container' }

  // Step 4: Schedule
  const [schedules, setSchedules] = useState({});
  // { [worry]: timeSlotId }

  // Step 5: Worry Appointment
  const [appointmentHour, setAppointmentHour] = useState(6);
  const [appointmentMinute, setAppointmentMinute] = useState(0);
  const [appointmentPeriod, setAppointmentPeriod] = useState('PM');

  const goToStep = useCallback((nextStep) => {
    setFadeKey(k => k + 1);
    setStep(nextStep);
  }, []);

  const addWorry = useCallback(() => {
    const trimmed = currentWorry.trim();
    if (!trimmed) return;
    setWorries(prev => [...prev, trimmed]);
    setCurrentWorry('');
  }, [currentWorry]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addWorry();
    }
  }, [addWorry]);

  const sortWorry = useCallback((worry, category) => {
    setSortedWorries(prev => ({ ...prev, [worry]: category }));
  }, []);

  const setSchedule = useCallback((worry, timeSlotId) => {
    setSchedules(prev => ({ ...prev, [worry]: timeSlotId }));
  }, []);

  const actionItems = worries.filter(w => sortedWorries[w] === 'action');
  const containerItems = worries.filter(w => sortedWorries[w] === 'container');
  const allSorted = worries.length > 0 && worries.every(w => sortedWorries[w]);
  const allScheduled = actionItems.length === 0 || actionItems.every(w => schedules[w]);

  const formatAppointmentTime = useCallback(() => {
    const h = appointmentHour;
    const m = appointmentMinute.toString().padStart(2, '0');
    return `${h}:${m} ${appointmentPeriod}`;
  }, [appointmentHour, appointmentMinute, appointmentPeriod]);

  const handleSave = useCallback(() => {
    try {
      const data = {
        actionItems: actionItems.map(w => ({
          worry: w,
          scheduledTime: TIME_SLOTS.find(s => s.id === schedules[w])?.label || 'Unscheduled',
        })),
        containerItems,
        worryAppointment: formatAppointmentTime(),
        date: new Date().toISOString(),
      };
      localStorage.setItem('aiforj_worry_container', JSON.stringify(data));
    } catch (_) {
      // localStorage unavailable
    }
    onComplete();
  }, [actionItems, containerItems, schedules, formatAppointmentTime, onComplete]);

  const dynamicPrompt = worries.length >= 3
    ? DYNAMIC_PROMPTS[(worries.length - 3) % DYNAMIC_PROMPTS.length]
    : null;

  // --- PROGRESS BAR ---
  const totalSteps = 5;
  const ProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressTrack}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{
            flex: 1,
            height: '100%',
            borderRadius: 4,
            background: s <= step ? 'var(--sage, #7A9E7E)' : 'rgba(122,158,126,0.15)',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>
      <div style={styles.progressLabel}>Step {step} of {totalSteps}</div>
    </div>
  );

  // --- STEP 1: INTRODUCTION ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Worry Postponement</div>
          <h2 style={styles.heading}>
            Let{'\u2019'}s get every worry out of your head and into a container.
          </h2>
          <div style={styles.psychoedCard}>
            <div style={styles.psychoedIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="var(--sage, #7A9E7E)" strokeWidth="1.5" fill="rgba(122,158,126,0.08)" />
                <path d="M10 6v5M10 13.5v.5" stroke="var(--sage, #7A9E7E)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p style={styles.psychoedText}>
              Research shows that when people know they <em>have</em> a dedicated time to worry,
              the worries intrude less during the rest of the day. You{'\u2019'}ll capture your worries,
              sort them, and set a daily worry appointment.
            </p>
          </div>
          <div style={styles.btnWrap}>
            <button
              onClick={() => goToStep(2)}
              style={styles.primaryBtn}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,158,126,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
              }}
            >
              Begin {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- STEP 2: BRAIN DUMP ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Brain Dump</div>
          <h2 style={styles.heading}>
            What{'\u2019'}s weighing on you?
          </h2>
          <p style={styles.subtext}>
            Type each worry and hit Add. Get them all out {'\u2014'} big or small.
          </p>

          {/* Input row */}
          <div style={styles.inputRow}>
            <input
              type="text"
              value={currentWorry}
              onChange={e => setCurrentWorry(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., I might not hit my deadline..."
              style={styles.textInput}
              onFocus={e => { e.target.style.borderColor = 'var(--sage, #7A9E7E)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(122,158,126,0.2)'; }}
            />
            <button
              onClick={addWorry}
              disabled={!currentWorry.trim()}
              style={{
                ...styles.addBtn,
                opacity: currentWorry.trim() ? 1 : 0.4,
                cursor: currentWorry.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Add
            </button>
          </div>

          {/* Dynamic prompt */}
          {dynamicPrompt && (
            <p style={styles.dynamicPrompt}>{dynamicPrompt}</p>
          )}

          {/* Worry count */}
          {worries.length > 0 && (
            <div style={styles.worryCount}>
              <span style={styles.worryCountNumber}>{worries.length}</span>
              <span style={styles.worryCountLabel}>
                {worries.length === 1 ? 'worry' : 'worries'} captured
              </span>
            </div>
          )}

          {/* Worry pills */}
          <div style={styles.worryPillContainer}>
            {worries.map((w, i) => (
              <div
                key={`${w}-${i}`}
                style={{
                  ...styles.worryPill,
                  animation: 'wpPillIn 0.35s cubic-bezier(0.16,1,0.3,1)',
                  animationFillMode: 'backwards',
                  animationDelay: `${i * 0.03}s`,
                }}
              >
                <span style={styles.worryPillDot} />
                <span style={styles.worryPillText}>{w}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={styles.btnRow}>
            <button onClick={() => goToStep(1)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            {worries.length >= 3 && (
              <button
                onClick={() => goToStep(3)}
                style={styles.primaryBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,158,126,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
                }}
              >
                That{'\u2019'}s everything {'\u2192'}
              </button>
            )}
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- STEP 3: SORT ---
  if (step === 3) {
    const unsorted = worries.filter(w => !sortedWorries[w]);
    const currentWorryToSort = unsorted[0];

    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Sort</div>
          <h2 style={styles.heading}>
            Can you act on it, or does it go in the container?
          </h2>
          <p style={styles.subtext}>
            For each worry, decide: is there a concrete action you can take, or should it be set aside?
          </p>

          {/* Current worry card to sort */}
          {currentWorryToSort && (
            <div style={styles.sortCurrentCard}>
              <div style={styles.sortCurrentLabel}>
                {unsorted.length} of {worries.length} remaining
              </div>
              <p style={styles.sortCurrentText}>
                {'\u201C'}{currentWorryToSort}{'\u201D'}
              </p>
              <div style={styles.sortBtnRow}>
                <button
                  onClick={() => sortWorry(currentWorryToSort, 'action')}
                  style={styles.sortBtnAction}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(122,158,126,0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))';
                  }}
                >
                  {'\u2705'} Can act on this
                </button>
                <button
                  onClick={() => sortWorry(currentWorryToSort, 'container')}
                  style={styles.sortBtnContainer}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(155,142,196,0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))';
                  }}
                >
                  {'\uD83D\uDCE6'} Container
                </button>
              </div>
            </div>
          )}

          {/* Sorted sections */}
          <div style={styles.sortedSections}>
            {/* Action items section */}
            {actionItems.length > 0 && (
              <div style={styles.sortedSectionAction}>
                <div style={styles.sortedSectionHeader}>
                  <span style={styles.sortedSectionDot('#7A9E7E')} />
                  <span style={styles.sortedSectionTitle}>Action items</span>
                  <span style={styles.sortedSectionCount}>{actionItems.length}</span>
                </div>
                <div style={styles.sortedCards}>
                  {actionItems.map((w, i) => (
                    <div
                      key={`action-${i}`}
                      style={{
                        ...styles.sortedCard,
                        borderColor: 'rgba(122,158,126,0.35)',
                        animation: 'wpCardSlide 0.3s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    >
                      <span style={{ ...styles.sortedCardIcon, color: 'var(--sage, #7A9E7E)' }}>{'\u2705'}</span>
                      <span style={styles.sortedCardText}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Container section */}
            {containerItems.length > 0 && (
              <div style={styles.sortedSectionContainer}>
                <div style={styles.sortedSectionHeader}>
                  <span style={styles.sortedSectionDot('#9B8EC4')} />
                  <span style={styles.sortedSectionTitle}>Container</span>
                  <span style={styles.sortedSectionCount}>{containerItems.length}</span>
                </div>
                {/* Jar visual */}
                <div style={styles.jarContainer}>
                  <svg width="100%" height="100%" viewBox="0 0 280 160" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.12, pointerEvents: 'none' }}>
                    {/* Jar lid */}
                    <rect x="80" y="10" width="120" height="16" rx="4" fill="var(--lavender, #9B8EC4)" />
                    {/* Jar body */}
                    <rect x="70" y="26" width="140" height="120" rx="16" fill="none" stroke="var(--lavender, #9B8EC4)" strokeWidth="2.5" />
                  </svg>
                  <div style={styles.sortedCards}>
                    {containerItems.map((w, i) => (
                      <div
                        key={`container-${i}`}
                        style={{
                          ...styles.sortedCard,
                          borderColor: 'rgba(155,142,196,0.35)',
                          animation: 'wpCardSlide 0.3s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        <span style={{ ...styles.sortedCardIcon, color: 'var(--lavender, #9B8EC4)' }}>{'\uD83D\uDCE6'}</span>
                        <span style={styles.sortedCardText}>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={styles.btnRow}>
            <button onClick={() => goToStep(2)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            {allSorted && (
              <button
                onClick={() => {
                  if (actionItems.length > 0) {
                    goToStep(4);
                  } else {
                    goToStep(5);
                  }
                }}
                style={styles.primaryBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,158,126,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
                }}
              >
                Next {'\u2192'}
              </button>
            )}
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- STEP 4: SCHEDULE ACTIONS ---
  if (step === 4) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Schedule</div>
          <h2 style={styles.heading}>
            When will you tackle each one?
          </h2>
          <p style={styles.subtext}>
            Assign a time window for each actionable worry. Making it concrete reduces the mental load.
          </p>

          <div style={styles.scheduleList}>
            {actionItems.map((w, i) => (
              <div key={`sched-${i}`} style={styles.scheduleItem}>
                <div style={styles.scheduleWorry}>
                  <span style={styles.scheduleWorryDot} />
                  <span style={styles.scheduleWorryText}>{w}</span>
                </div>
                <div style={styles.timeSlotRow}>
                  {TIME_SLOTS.map(slot => {
                    const isSelected = schedules[w] === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSchedule(w, slot.id)}
                        style={{
                          ...styles.timeSlotBtn,
                          background: isSelected ? 'var(--sage, #7A9E7E)' : 'var(--surface-elevated, #fff)',
                          color: isSelected ? '#fff' : 'var(--text-secondary, #666)',
                          borderColor: isSelected ? 'var(--sage, #7A9E7E)' : 'rgba(122,158,126,0.2)',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Mini schedule preview */}
          {actionItems.some(w => schedules[w]) && (
            <div style={styles.schedulePreview}>
              <div style={styles.schedulePreviewTitle}>Your plan</div>
              {actionItems.filter(w => schedules[w]).map((w, i) => (
                <div key={`prev-${i}`} style={styles.schedulePreviewRow}>
                  <span style={styles.schedulePreviewTime}>
                    {TIME_SLOTS.find(s => s.id === schedules[w])?.label}
                  </span>
                  <span style={styles.schedulePreviewWorry}>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={styles.btnRow}>
            <button onClick={() => goToStep(3)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(5)}
              disabled={!allScheduled}
              style={{
                ...styles.primaryBtn,
                opacity: allScheduled ? 1 : 0.4,
                cursor: allScheduled ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- STEP 5: WORRY APPOINTMENT ---
  if (step === 5) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Worry Appointment</div>
          <h2 style={styles.heading}>
            Set your daily worry appointment
          </h2>
          <p style={styles.subtext}>
            Choose a 15-minute window each day when you{'\u2019'}ll sit with your worries intentionally.
            Outside that window, worries get postponed.
          </p>

          {/* Time picker */}
          <div style={styles.timePickerWrap}>
            <div style={styles.timePicker}>
              {/* Hour */}
              <div style={styles.timeColumn}>
                <button
                  onClick={() => setAppointmentHour(h => h >= 12 ? 1 : h + 1)}
                  style={styles.timeArrow}
                  aria-label="Increase hour"
                >
                  {'\u25B2'}
                </button>
                <div style={styles.timeDisplay}>
                  {appointmentHour}
                </div>
                <button
                  onClick={() => setAppointmentHour(h => h <= 1 ? 12 : h - 1)}
                  style={styles.timeArrow}
                  aria-label="Decrease hour"
                >
                  {'\u25BC'}
                </button>
              </div>

              <div style={styles.timeColon}>:</div>

              {/* Minute */}
              <div style={styles.timeColumn}>
                <button
                  onClick={() => setAppointmentMinute(m => {
                    const options = [0, 15, 30, 45];
                    const idx = options.indexOf(m);
                    return options[(idx + 1) % options.length];
                  })}
                  style={styles.timeArrow}
                  aria-label="Increase minute"
                >
                  {'\u25B2'}
                </button>
                <div style={styles.timeDisplay}>
                  {appointmentMinute.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => setAppointmentMinute(m => {
                    const options = [0, 15, 30, 45];
                    const idx = options.indexOf(m);
                    return options[(idx - 1 + options.length) % options.length];
                  })}
                  style={styles.timeArrow}
                  aria-label="Decrease minute"
                >
                  {'\u25BC'}
                </button>
              </div>

              {/* AM/PM toggle */}
              <div style={styles.periodToggle}>
                <button
                  onClick={() => setAppointmentPeriod('AM')}
                  style={{
                    ...styles.periodBtn,
                    background: appointmentPeriod === 'AM' ? 'var(--sage, #7A9E7E)' : 'transparent',
                    color: appointmentPeriod === 'AM' ? '#fff' : 'var(--text-muted, #999)',
                  }}
                >
                  AM
                </button>
                <button
                  onClick={() => setAppointmentPeriod('PM')}
                  style={{
                    ...styles.periodBtn,
                    background: appointmentPeriod === 'PM' ? 'var(--sage, #7A9E7E)' : 'transparent',
                    color: appointmentPeriod === 'PM' ? '#fff' : 'var(--text-muted, #999)',
                  }}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Reminder message */}
          <div style={styles.reminderBanner}>
            <p style={styles.reminderBannerText}>
              When a worry pops up, remind yourself:
            </p>
            <p style={styles.reminderBannerQuote}>
              {'\u201C'}I{'\u2019'}ll deal with that at{' '}
              <strong style={{ color: 'var(--sage, #7A9E7E)' }}>{formatAppointmentTime()}</strong>.{'\u201D'}
            </p>
          </div>

          {/* Navigation */}
          <div style={styles.btnRow}>
            <button
              onClick={() => {
                if (actionItems.length > 0) {
                  goToStep(4);
                } else {
                  goToStep(3);
                }
              }}
              style={styles.backBtn}
            >
              {'\u2190'} Back
            </button>
            <button
              onClick={() => goToStep(6)}
              style={styles.primaryBtn}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,158,126,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
              }}
            >
              See summary {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- COMPLETION ---
  return (
    <div style={styles.container}>
      <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'wpCompletePop 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
            {'\u2728'}
          </div>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>
            Your Worry Plan
          </h2>
          <p style={{ ...styles.subtext, textAlign: 'center', marginBottom: 0 }}>
            Worries contained. Actions scheduled. You{'\u2019'}re in control.
          </p>
        </div>

        {/* Worry appointment — prominent */}
        <div style={styles.appointmentBanner}>
          <div style={styles.appointmentLabel}>Your daily worry appointment</div>
          <div style={styles.appointmentTime}>{formatAppointmentTime()}</div>
          <div style={styles.appointmentSub}>15 minutes {'\u2014'} every day</div>
        </div>

        {/* Action items checklist */}
        {actionItems.length > 0 && (
          <div style={styles.summarySection}>
            <div style={styles.summarySectionHeader}>
              <span style={styles.sortedSectionDot('#7A9E7E')} />
              <span style={styles.summarySectionTitle}>Action items</span>
            </div>
            <div style={styles.summaryChecklist}>
              {actionItems.map((w, i) => (
                <div key={`sum-action-${i}`} style={styles.summaryCheckItem}>
                  <div style={styles.summaryCheckbox}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="15" rx="4" stroke="var(--sage, #7A9E7E)" strokeWidth="1.5" fill="rgba(122,158,126,0.06)" />
                    </svg>
                  </div>
                  <div style={styles.summaryCheckContent}>
                    <span style={styles.summaryCheckText}>{w}</span>
                    <span style={styles.summaryCheckTime}>
                      {TIME_SLOTS.find(s => s.id === schedules[w])?.label || 'Unscheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Container items — jar visual */}
        {containerItems.length > 0 && (
          <div style={styles.summarySection}>
            <div style={styles.summarySectionHeader}>
              <span style={styles.sortedSectionDot('#9B8EC4')} />
              <span style={styles.summarySectionTitle}>In the container</span>
            </div>
            <div style={styles.summaryJar}>
              {/* Jar SVG */}
              <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                {/* Jar lid */}
                <rect x="90" y="8" width="120" height="14" rx="4" fill="rgba(155,142,196,0.15)" stroke="rgba(155,142,196,0.25)" strokeWidth="1" />
                <rect x="105" y="2" width="90" height="10" rx="3" fill="rgba(155,142,196,0.1)" stroke="rgba(155,142,196,0.2)" strokeWidth="1" />
                {/* Jar body */}
                <path
                  d="M78 22 C78 22, 72 35, 72 50 L72 170 C72 185, 85 195, 100 195 L200 195 C215 195, 228 185, 228 170 L228 50 C228 35, 222 22, 222 22 Z"
                  fill="rgba(155,142,196,0.04)"
                  stroke="rgba(155,142,196,0.2)"
                  strokeWidth="1.5"
                />
              </svg>
              <div style={styles.summaryJarContent}>
                {containerItems.map((w, i) => (
                  <div
                    key={`sum-container-${i}`}
                    style={{
                      ...styles.summaryJarItem,
                      animation: 'wpPillIn 0.35s cubic-bezier(0.16,1,0.3,1)',
                      animationDelay: `${i * 0.08}s`,
                      animationFillMode: 'backwards',
                    }}
                  >
                    <span style={styles.summaryJarDot} />
                    <span style={styles.summaryJarText}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{worries.length}</span>
            <span style={styles.statLabel}>worries captured</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{actionItems.length}</span>
            <span style={styles.statLabel}>action items</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{containerItems.length}</span>
            <span style={styles.statLabel}>contained</span>
          </div>
        </div>

        {/* Save button */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={handleSave}
            style={styles.primaryBtn}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(122,158,126,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(122,158,126,0.3)';
            }}
          >
            Save & finish {'\u2192'}
          </button>
        </div>
      </div>
      <style>{keyframes}</style>
    </div>
  );
}

// --- KEYFRAMES ---
const keyframes = `
  @keyframes wpFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes wpCompletePop {
    0% { opacity: 0; transform: scale(0.5); }
    60% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes wpPillIn {
    0% { opacity: 0; transform: translateX(-12px) scale(0.95); }
    100% { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes wpCardSlide {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

// --- STYLES ---
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  content: {
    padding: '24px 24px 0',
    maxWidth: 560,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  fadeIn: {
    animation: 'wpFadeIn 0.45s cubic-bezier(0.16,1,0.3,1)',
  },

  // Progress
  progressContainer: {
    padding: '16px 24px 0',
    maxWidth: 560,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  progressTrack: {
    display: 'flex',
    gap: 6,
    height: 5,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.06em',
    textAlign: 'right',
  },

  // Typography
  stepTag: {
    display: 'inline-block',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--sage, #7A9E7E)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 12,
    padding: '4px 10px',
    background: 'rgba(122,158,126,0.08)',
    borderRadius: 6,
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 15,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.65,
    margin: '0 0 24px',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Psychoeducation card
  psychoedCard: {
    display: 'flex',
    gap: 14,
    padding: '18px 20px',
    background: 'rgba(122,158,126,0.05)',
    borderRadius: 14,
    border: '1px solid rgba(122,158,126,0.12)',
    marginBottom: 32,
  },
  psychoedIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  psychoedText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.7,
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
  },

  // Inputs
  textInput: {
    flex: 1,
    padding: '14px 20px',
    border: '1.5px solid rgba(122,158,126,0.2)',
    borderRadius: 14,
    background: 'rgba(122,158,126,0.03)',
    fontSize: 15,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
  },
  addBtn: {
    padding: '14px 22px',
    borderRadius: 14,
    background: 'var(--sage, #7A9E7E)',
    color: '#fff',
    border: 'none',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },

  // Dynamic prompt
  dynamicPrompt: {
    fontSize: 13,
    color: 'var(--sage, #7A9E7E)',
    fontFamily: "'DM Sans', sans-serif",
    fontStyle: 'italic',
    margin: '0 0 16px',
    animation: 'wpFadeIn 0.3s ease',
  },

  // Worry count
  worryCount: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  worryCountNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--sage, #7A9E7E)',
  },
  worryCountLabel: {
    fontSize: 14,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Worry pills
  worryPillContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  worryPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'var(--surface-elevated, #fff)',
    border: '1.5px solid rgba(122,158,126,0.15)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
  },
  worryPillDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--sage, #7A9E7E)',
    flexShrink: 0,
  },
  worryPillText: {
    fontSize: 14,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.45,
  },

  // Buttons
  btnWrap: {
    textAlign: 'center',
    marginTop: 28,
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  primaryBtn: {
    padding: '14px 32px',
    borderRadius: 50,
    background: 'var(--sage, #7A9E7E)',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(122,158,126,0.3)',
  },
  backBtn: {
    padding: '14px 20px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted, #999)',
    border: '1.5px solid rgba(122,158,126,0.15)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Sort step
  sortCurrentCard: {
    padding: '24px',
    background: 'var(--surface-elevated, #fff)',
    border: '1.5px solid var(--border, rgba(122,158,126,0.12))',
    borderRadius: 16,
    boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
    marginBottom: 24,
    textAlign: 'center',
  },
  sortCurrentLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 12,
  },
  sortCurrentText: {
    fontSize: 17,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'Fraunces', serif",
    lineHeight: 1.5,
    margin: '0 0 20px',
    fontStyle: 'italic',
  },
  sortBtnRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  sortBtnAction: {
    padding: '12px 20px',
    borderRadius: 12,
    background: 'var(--surface-elevated, #fff)',
    color: 'var(--sage, #7A9E7E)',
    border: '2px solid var(--sage, #7A9E7E)',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
  },
  sortBtnContainer: {
    padding: '12px 20px',
    borderRadius: 12,
    background: 'var(--surface-elevated, #fff)',
    color: 'var(--lavender, #9B8EC4)',
    border: '2px solid var(--lavender, #9B8EC4)',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
  },

  // Sorted sections
  sortedSections: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  sortedSectionAction: {
    padding: '16px',
    background: 'rgba(122,158,126,0.04)',
    borderRadius: 14,
    border: '1px solid rgba(122,158,126,0.12)',
  },
  sortedSectionContainer: {
    padding: '16px',
    background: 'rgba(155,142,196,0.04)',
    borderRadius: 14,
    border: '1px solid rgba(155,142,196,0.12)',
  },
  sortedSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sortedSectionDot: (color) => ({
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  sortedSectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-primary, #1a1a1a)',
    flex: 1,
  },
  sortedSectionCount: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    fontWeight: 600,
  },
  sortedCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  sortedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 10,
    border: '1.5px solid',
  },
  sortedCardIcon: {
    fontSize: 14,
    flexShrink: 0,
  },
  sortedCardText: {
    fontSize: 13,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  },
  jarContainer: {
    position: 'relative',
    minHeight: 80,
    padding: '8px 0',
  },

  // Schedule step
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 24,
  },
  scheduleItem: {
    padding: '16px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 14,
    border: '1.5px solid rgba(122,158,126,0.12)',
    boxShadow: 'var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.06))',
  },
  scheduleWorry: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  scheduleWorryDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--sage, #7A9E7E)',
    flexShrink: 0,
  },
  scheduleWorryText: {
    fontSize: 14,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.45,
  },
  timeSlotRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeSlotBtn: {
    padding: '8px 14px',
    borderRadius: 20,
    border: '1.5px solid',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    whiteSpace: 'nowrap',
  },
  schedulePreview: {
    padding: '16px 18px',
    background: 'rgba(122,158,126,0.05)',
    borderRadius: 12,
    borderLeft: '3px solid var(--sage, #7A9E7E)',
  },
  schedulePreviewTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--sage, #7A9E7E)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 10,
  },
  schedulePreviewRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 12,
    padding: '6px 0',
  },
  schedulePreviewTime: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--sage, #7A9E7E)',
    minWidth: 110,
    flexShrink: 0,
  },
  schedulePreviewWorry: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.45,
  },

  // Worry Appointment (Step 5)
  timePickerWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 32,
  },
  timePicker: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '24px 32px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 20,
    border: '1.5px solid rgba(122,158,126,0.15)',
    boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
  },
  timeColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  timeArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted, #999)',
    fontSize: 10,
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'all 0.15s ease',
  },
  timeDisplay: {
    fontFamily: "'Fraunces', serif",
    fontSize: 42,
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1,
    minWidth: 56,
    textAlign: 'center',
    userSelect: 'none',
  },
  timeColon: {
    fontFamily: "'Fraunces', serif",
    fontSize: 36,
    fontWeight: 500,
    color: 'var(--sage, #7A9E7E)',
    lineHeight: 1,
    padding: '0 2px',
    alignSelf: 'center',
  },
  periodToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginLeft: 12,
  },
  periodBtn: {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1.5px solid rgba(122,158,126,0.2)',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.06em',
    outline: 'none',
  },

  // Reminder banner
  reminderBanner: {
    padding: '20px 24px',
    background: 'rgba(122,158,126,0.05)',
    borderRadius: 14,
    border: '1px solid rgba(122,158,126,0.12)',
    textAlign: 'center',
    marginBottom: 8,
  },
  reminderBannerText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    margin: '0 0 8px',
  },
  reminderBannerQuote: {
    fontSize: 17,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'Fraunces', serif",
    fontStyle: 'italic',
    margin: 0,
    lineHeight: 1.5,
  },

  // Completion: Appointment banner
  appointmentBanner: {
    textAlign: 'center',
    padding: '24px 20px',
    background: 'rgba(122,158,126,0.06)',
    borderRadius: 16,
    border: '2px solid rgba(122,158,126,0.2)',
    marginBottom: 24,
  },
  appointmentLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--sage, #7A9E7E)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 8,
  },
  appointmentTime: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(2rem, 6vw, 2.8rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.2,
    marginBottom: 6,
  },
  appointmentSub: {
    fontSize: 13,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
  },

  // Completion: Summary sections
  summarySection: {
    marginBottom: 20,
  },
  summarySectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summarySectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-primary, #1a1a1a)',
  },
  summaryChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryCheckItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '12px 16px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 12,
    border: '1px solid rgba(122,158,126,0.15)',
  },
  summaryCheckbox: {
    flexShrink: 0,
    marginTop: 1,
  },
  summaryCheckContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  summaryCheckText: {
    fontSize: 14,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.45,
  },
  summaryCheckTime: {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--sage, #7A9E7E)',
    letterSpacing: '0.04em',
  },

  // Completion: Jar visual
  summaryJar: {
    position: 'relative',
    minHeight: 140,
    padding: '24px 20px',
    overflow: 'hidden',
    borderRadius: 14,
    background: 'rgba(155,142,196,0.03)',
    border: '1px solid rgba(155,142,196,0.12)',
  },
  summaryJarContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  summaryJarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 14px',
    background: 'rgba(155,142,196,0.06)',
    borderRadius: 8,
    border: '1px solid rgba(155,142,196,0.15)',
  },
  summaryJarDot: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--lavender, #9B8EC4)',
    flexShrink: 0,
  },
  summaryJarText: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  },

  // Stats row
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: '16px 20px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 12,
    border: '1px solid var(--border, rgba(122,158,126,0.12))',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--sage, #7A9E7E)',
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "'DM Sans', sans-serif",
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    background: 'var(--border, rgba(122,158,126,0.12))',
    flexShrink: 0,
  },
};
