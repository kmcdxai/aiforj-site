"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';

function total(list, key) {
  return list.reduce((sum, item) => sum + Number(item[key] || 0), 0);
}

export default function DemandResourceAudit({ onComplete }) {
  const [demandText, setDemandText] = useState('');
  const [demandCost, setDemandCost] = useState(3);
  const [resourceText, setResourceText] = useState('');
  const [resourceValue, setResourceValue] = useState(3);
  const [demands, setDemands] = useState([]);
  const [resources, setResources] = useState([]);

  const demandTotal = useMemo(() => total(demands, 'cost'), [demands]);
  const resourceTotal = useMemo(() => total(resources, 'value'), [resources]);
  const deficit = demandTotal - resourceTotal;

  return (
    <InterventionShell maxWidth={880}>
      <div style={shellStyles.card}>
        <StepDots currentStep={demands.length || resources.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Demand-Resource Audit" />
        <h2 style={shellStyles.heading}>What are the demands and resources in your life right now?</h2>
        <div style={{ display: 'grid', gap: 20, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
            <strong>Demands</strong>
            <input value={demandText} onChange={(event) => setDemandText(event.target.value)} placeholder="Add a demand" style={{ ...shellStyles.textInput, marginTop: 12 }} />
            <label style={{ ...shellStyles.label, display: 'block', marginTop: 12 }}>Energy cost: {demandCost}/5</label>
            <input type="range" min="1" max="5" value={demandCost} onChange={(event) => setDemandCost(Number(event.target.value))} style={{ width: '100%', accentColor: ACCENT, marginTop: 8 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => demandText.trim() && setDemands((current) => [...current, { text: demandText.trim(), cost: demandCost }])}>Add demand</SecondaryButton>
            </div>
            <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
              {demands.map((item, index) => <li key={`${item.text}-${index}`}>{item.text} ({item.cost})</li>)}
            </ul>
          </div>
          <div style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
            <strong>Resources</strong>
            <input value={resourceText} onChange={(event) => setResourceText(event.target.value)} placeholder="Add a resource" style={{ ...shellStyles.textInput, marginTop: 12 }} />
            <label style={{ ...shellStyles.label, display: 'block', marginTop: 12 }}>Energy provided: {resourceValue}/5</label>
            <input type="range" min="1" max="5" value={resourceValue} onChange={(event) => setResourceValue(Number(event.target.value))} style={{ width: '100%', accentColor: ACCENT, marginTop: 8 }} />
            <div style={shellStyles.buttonRow}>
              <SecondaryButton onClick={() => resourceText.trim() && setResources((current) => [...current, { text: resourceText.trim(), value: resourceValue }])}>Add resource</SecondaryButton>
            </div>
            <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
              {resources.map((item, index) => <li key={`${item.text}-${index}`}>{item.text} (+{item.value})</li>)}
            </ul>
          </div>
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(212, 168, 67, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>
            Demands: <strong style={{ color: 'var(--text-primary)' }}>{demandTotal}</strong> | Resources: <strong style={{ color: 'var(--text-primary)' }}>{resourceTotal}</strong>
          </p>
          <p style={{ ...shellStyles.body, marginTop: 10 }}>
            {deficit > 0 ? `You are running a deficit of ${deficit} points. This is the math of burnout.` : 'Your resources are meeting or exceeding your demands right now.'}
          </p>
        </div>
        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!demands.length || !resources.length}
            onClick={() => {
              appendToStorage('aiforj_demand_resource_audit', {
                demands,
                resources,
                demandTotal,
                resourceTotal,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Save audit
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
