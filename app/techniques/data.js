export const TECHNIQUES = [
  // ─── 1. BOX BREATHING ───────────────────────────────────────────────
  {
    slug: "box-breathing",
    title: "Box Breathing Technique: A Step-by-Step Guide",
    metaTitle: "Box Breathing Technique: Step-by-Step Guide | 4-4-4-4 Breathing",
    metaDescription:
      "Learn the box breathing technique used by Navy SEALs to calm anxiety in minutes. Follow our guided 4-4-4-4 breathing exercise for instant stress relief.",
    keywords: "box breathing, box breathing technique, 4-4-4-4 breathing",
    subtitle: "For anxiety, panic, anger, and sleeplessness",
    time: "4 minutes",
    modality: "Somatic/Clinical",
    origin:
      "Developed by the U.S. Navy SEALs for high-stress combat situations and adopted by clinical psychologists for anxiety management.",
    whatThisIs:
      "Box breathing is one of the simplest and most powerful breathing techniques you can learn. It gets its name from its four equal sides — like a box — where you inhale, hold, exhale, and hold again, each for the same count. Navy SEALs use this technique to stay calm and focused under extreme pressure, and therapists worldwide recommend it for anxiety, panic attacks, and emotional regulation.\n\nThe beauty of box breathing is that you can do it anywhere — in a meeting, in bed, on the subway — and nobody needs to know. It requires no equipment, no app, no special training. Within 60 to 90 seconds, most people notice their heart rate dropping and their mind clearing. It works because it gives your nervous system a direct, physical signal that you are safe. When your breathing is slow and rhythmic, your brain interprets that as \"no threat detected\" and begins dialing down the stress response.\n\nWhether you're dealing with a full-blown panic attack or just the low-grade hum of daily anxiety, box breathing meets you where you are and brings you back to baseline.",
    neuroscience:
      "Box breathing is a paced-breathing exercise. Slow, regular breathing can help many people feel less activated in the moment, and some studies suggest it supports autonomic regulation as well. The equal inhale-hold-exhale-hold rhythm gives your attention something steady to follow, which can interrupt the feeling of spiraling. The exact mechanism is still being studied, so we frame it as a practical calming skill rather than a guaranteed biological hack.",
    whenToUse: [
      "Before a big meeting or presentation",
      "During a panic attack",
      "When anger is escalating",
      "Before a difficult conversation",
      "When you can't fall asleep",
    ],
    relatedSlugs: ["physiological-sigh", "progressive-muscle-relaxation"],
    faqs: [
      {
        q: "How long should I do box breathing?",
        a: "Most people feel calmer after 4 full cycles (about 2 minutes). For deeper relaxation, continue for 4-5 minutes. If you're using it for sleep, keep going until you drift off.",
      },
      {
        q: "Is box breathing the same as 4-4-4-4 breathing?",
        a: "Yes. Box breathing and 4-4-4-4 breathing are the same technique. The name refers to the four equal phases — 4 counts inhale, 4 counts hold, 4 counts exhale, 4 counts hold.",
      },
      {
        q: "Can box breathing help with panic attacks?",
        a: "Yes. Box breathing is one of the most recommended techniques for panic attacks because it directly counteracts hyperventilation and activates your body's calming response. Start as soon as you notice panic symptoms.",
      },
      {
        q: "What if I can't hold my breath for 4 seconds?",
        a: "Start with 2-2-2-2 or 3-3-3-3 counts instead. The key is equal timing across all four phases, not hitting a specific number. Build up gradually as your CO2 tolerance improves.",
      },
    ],
    steps: [
      {
        title: "Get Comfortable",
        instruction:
          "Find a comfortable position — sitting upright or lying down. Close your eyes or soften your gaze. Place one hand on your chest and one on your belly.",
        type: "reflection",
      },
      {
        title: "Cycle 1: Breathe with the Box",
        instruction:
          "Follow the animation. Breathe in through your nose for 4 counts, hold for 4 counts, exhale slowly through your mouth for 4 counts, and hold for 4 counts.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 4 },
        duration: 16,
      },
      {
        title: "Cycle 2",
        instruction:
          "Continue the pattern. Notice your heart rate beginning to slow. Let each breath be smooth and effortless.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 4 },
        duration: 16,
      },
      {
        title: "Cycle 3",
        instruction:
          "You're halfway there. If your mind wanders, gently bring your attention back to the count. No judgment.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 4 },
        duration: 16,
      },
      {
        title: "Cycle 4",
        instruction:
          "Final cycle. Let this one be the deepest and most relaxed. Sink into the rhythm.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 4 },
        duration: 16,
      },
      {
        title: "Check In",
        instruction:
          "How do you feel compared to when you started? Take a moment to notice any shifts in your body or mind.",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 2. PHYSIOLOGICAL SIGH ──────────────────────────────────────────
  {
    slug: "physiological-sigh",
    title: "The Physiological Sigh: The Fastest Way to Calm Down",
    metaTitle:
      "Physiological Sigh: The Fastest Science-Backed Way to Calm Down",
    metaDescription:
      "Learn the physiological sigh — a double inhale and long exhale technique from Stanford research. A fast evidence-framed way to reduce stress in real time.",
    keywords:
      "physiological sigh, double inhale exhale, stress relief breathing",
    subtitle: "For acute stress, panic spirals, and emotional reactivity",
    time: "2 minutes",
    modality: "Neuroscience-based",
    origin:
      "Identified through Stanford University's Huberman Lab research as the most efficient real-time stress reduction breathing pattern.",
    whatThisIs:
      "The physiological sigh is a simple breathing pattern built around two quick inhales followed by one long exhale. Many people notice a version of it naturally when stressed or when their body is finally starting to settle.\n\nRecent research has made this pattern especially popular because brief daily practice may reduce stress and improve mood. That does not mean it is the one perfect breathing method for everyone, but it is one promising real-time option when you need something fast, discreet, and easy to remember.\n\nThe technique is simple: two quick inhales through the nose (the second one is a short \"top-off\" breath), followed by one long, slow exhale through the mouth. One rep takes about 10 seconds, and many people feel noticeably calmer after a few rounds.",
    neuroscience:
      "The working theory is straightforward: the second inhale helps fully expand the breath, and the long exhale gives your body a slower rhythm to follow. Longer exhales are commonly associated with a calmer physiological state, though the exact mechanism is still being studied. We describe this as a promising breath-regulation tool, not as a guaranteed shortcut that works the same way for every person.",
    whenToUse: [
      "When you need to calm down in under 60 seconds",
      "Before responding to a triggering text or email",
      "Mid-argument when emotions are high",
      "After receiving bad news",
      "During a panic spiral",
    ],
    relatedSlugs: ["box-breathing", "vagal-toning"],
    faqs: [
      {
        q: "How is the physiological sigh different from deep breathing?",
        a: "The key difference is the double inhale. The second short inhale \"tops off\" your lungs and reinflates collapsed air sacs, making the subsequent exhale far more effective at clearing CO2 and activating your calming response.",
      },
      {
        q: "How many physiological sighs do I need to do?",
        a: "Even one single physiological sigh can create a noticeable calming effect. For best results, do 3-5 cycles. In the Stanford study, participants practiced for 5 minutes daily.",
      },
      {
        q: "Can I do the physiological sigh during a conversation?",
        a: "Absolutely. It's one of the most discreet calming techniques available. A single physiological sigh looks natural and takes only a few seconds. Nobody will notice.",
      },
    ],
    steps: [
      {
        title: "Prepare",
        instruction:
          "You can do this sitting, standing, or lying down. No special position needed. This works best breathing in through your nose and out through your mouth.",
        type: "reflection",
      },
      {
        title: "Sigh 1: Double Inhale + Long Exhale",
        instruction:
          "Take a deep breath in through your nose... then before you exhale, take a second shorter inhale to top off your lungs. Now exhale slowly and fully through your mouth, letting all the air out.",
        type: "breathing",
        breathe: { inhale: 4, hold: 1, exhale: 8 },
        duration: 13,
      },
      {
        title: "Sigh 2",
        instruction:
          "Again — long inhale through the nose, quick second inhale to top off, then a long slow exhale. Let your shoulders drop on the exhale.",
        type: "breathing",
        breathe: { inhale: 4, hold: 1, exhale: 8 },
        duration: 13,
      },
      {
        title: "Sigh 3",
        instruction:
          "Notice your heart rate already beginning to slow. Deep inhale, short top-off inhale, long exhale.",
        type: "breathing",
        breathe: { inhale: 4, hold: 1, exhale: 8 },
        duration: 13,
      },
      {
        title: "Sigh 4",
        instruction:
          "Let this exhale be even longer and more relaxed. Feel the tension leaving your body with each breath out.",
        type: "breathing",
        breathe: { inhale: 4, hold: 1, exhale: 8 },
        duration: 13,
      },
      {
        title: "Sigh 5",
        instruction:
          "Final rep. Make this one count — deepest inhale, fullest top-off, longest exhale.",
        type: "breathing",
        breathe: { inhale: 4, hold: 1, exhale: 8 },
        duration: 13,
      },
      {
        title: "Notice the Shift",
        instruction:
          "Sit quietly for a moment and notice how your body feels. Most people report feeling significantly calmer after just these five breaths.",
        type: "reflection",
      },
    ],
  },

  // ─── 3. 54321 GROUNDING ─────────────────────────────────────────────
  {
    slug: "54321-grounding",
    title: "5-4-3-2-1 Grounding Technique for Anxiety and Panic",
    metaTitle:
      "5-4-3-2-1 Grounding Technique for Anxiety & Panic | Guided Exercise",
    metaDescription:
      "Use the 54321 grounding technique to stop anxiety and panic attacks fast. This guided sensory exercise brings you back to the present moment in minutes.",
    keywords:
      "54321 grounding, grounding technique anxiety, grounding exercise",
    subtitle:
      "For panic attacks, dissociation, anxiety spikes, and feeling overwhelmed",
    time: "5 minutes",
    modality: "DBT",
    origin:
      "Developed from Dialectical Behavior Therapy (DBT) and clinical anxiety intervention protocols as a sensory-based grounding tool.",
    whatThisIs:
      "The 5-4-3-2-1 grounding technique is a sensory awareness exercise that pulls you out of your head and back into the present moment. When anxiety, panic, or dissociation hijack your brain, they pull your attention into the future (\"what if\") or the past (\"what happened\"). This technique forces your brain to engage with what's actually happening right now by systematically working through your five senses.\n\nYou'll name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It sounds simple — and it is — but that's exactly why it works. Your brain can't simultaneously process sensory information AND spiral into catastrophic thinking. It has to choose, and by deliberately flooding it with sensory data, you force it to choose the present.\n\nThis is one of the most widely recommended techniques in therapy for panic attacks, dissociative episodes, PTSD flashbacks, and general anxiety. It works anywhere, takes no preparation, and is especially powerful when you feel like you're losing your grip on reality.",
    neuroscience:
      "The practical mechanism is attentional: grounding shifts you from threat-focused rumination toward concrete sensory input in the present moment. Rather than claiming one brain area simply switches off another, we frame this as a reorientation skill. Sensory scanning can interrupt spiraling long enough for your body and attention to settle.",
    whenToUse: [
      "During a panic attack or anxiety spike",
      "When you feel dissociated or \"not real\"",
      "After a triggering event or flashback",
      "When overwhelmed in a crowded place",
      "When derealization hits",
    ],
    relatedSlugs: ["tipp-skill", "body-scan"],
    faqs: [
      {
        q: "Does the 54321 technique work for panic attacks?",
        a: "Yes — it's one of the most recommended techniques for panic attacks. By forcing your brain to process sensory information, it interrupts the panic cycle. Many people find it effective within 2-3 minutes.",
      },
      {
        q: "What if I can't find 2 things I smell or 1 thing I taste?",
        a: "Get creative. Smell your sleeve, your hand, the air itself. For taste, notice the taste already in your mouth — coffee, toothpaste, or just saliva. The point is to engage the sense, not to find something special.",
      },
      {
        q: "Can I use 54321 grounding for dissociation?",
        a: "Absolutely. It's one of the primary techniques recommended for dissociative episodes and derealization. The sensory engagement helps anchor you back into your body and the present moment.",
      },
      {
        q: "How often can I do the 54321 technique?",
        a: "As often as you need it. There are no limits or side effects. Some people use it multiple times daily during high-anxiety periods.",
      },
    ],
    steps: [
      {
        title: "Pause and Breathe",
        instruction:
          "Before we begin, take one slow, deep breath. In through your nose... out through your mouth. You're safe right now, and we're going to bring you back to the present moment.",
        type: "reflection",
      },
      {
        title: "5 Things You Can See",
        instruction:
          "Look around you. Name 5 things you can see right now. Be specific — notice colors, textures, shapes.",
        type: "multi-input",
        fields: ["I see...", "I see...", "I see...", "I see...", "I see..."],
      },
      {
        title: "4 Things You Can Touch",
        instruction:
          "Reach out and touch 4 things near you. Notice the texture, temperature, and weight of each one.",
        type: "multi-input",
        fields: [
          "I can touch...",
          "I can touch...",
          "I can touch...",
          "I can touch...",
        ],
      },
      {
        title: "3 Things You Can Hear",
        instruction:
          "Close your eyes for a moment. What do you hear? Listen for subtle sounds you might normally tune out.",
        type: "multi-input",
        fields: ["I hear...", "I hear...", "I hear..."],
      },
      {
        title: "2 Things You Can Smell",
        instruction:
          "What can you smell right now? If nothing is obvious, smell your hands, your clothes, or the air itself.",
        type: "multi-input",
        fields: ["I smell...", "I smell..."],
      },
      {
        title: "1 Thing You Can Taste",
        instruction:
          "What can you taste right now? Notice whatever is in your mouth — coffee, toothpaste, or simply the taste of your own mouth.",
        type: "text-input",
        placeholder: "I taste...",
      },
      {
        title: "You're Here",
        instruction:
          "Take another deep breath. You just engaged all five senses and brought yourself fully into the present moment. The anxiety may still be there, but you're grounded in reality. You're here. You're safe.",
        type: "reflection",
      },
    ],
  },

  // ─── 4. THOUGHT DEFUSION ────────────────────────────────────────────
  {
    slug: "thought-defusion",
    title: "Thought Defusion: How to Detach from Intrusive Thoughts",
    metaTitle:
      "Thought Defusion: How to Detach from Intrusive Thoughts | ACT Technique",
    metaDescription:
      "Learn ACT thought defusion techniques to create distance from intrusive and negative thoughts. Stop believing everything your mind tells you with this guided exercise.",
    keywords:
      "thought defusion, ACT defusion, intrusive thoughts technique",
    subtitle:
      "For intrusive thoughts, rumination, imposter syndrome, and catastrophizing",
    time: "4 minutes",
    modality: "ACT",
    origin:
      "Developed by Steven Hayes as a core component of Acceptance and Commitment Therapy (ACT).",
    whatThisIs:
      "Thought defusion is the practice of seeing your thoughts as just thoughts — not facts, not commands, not truths you have to act on. Most of us are so fused with our thinking that we don't even notice the difference between \"I'm having a thought that I'm a failure\" and \"I am a failure.\" Defusion creates that crucial gap.\n\nThis technique comes from Acceptance and Commitment Therapy (ACT), created by psychologist Steven Hayes. Unlike CBT, which asks you to challenge or argue with your thoughts, ACT takes a different approach: it asks you to change your relationship with the thought instead of changing the thought itself. You don't have to prove the thought wrong. You just have to stop treating it like gospel.\n\nThought defusion uses creative exercises — like prefacing thoughts with \"I'm having the thought that...\", repeating a word until it loses meaning, or visualizing thoughts as leaves floating down a stream. These exercises sound unusual, but they work because they engage a different part of your brain — the observer — and pull you out of the default mode network's rumination loop.",
    neuroscience:
      "Thought defusion creates psychological distance from thoughts by engaging metacognitive awareness — the ability to think about your thinking. This activates the observer network (lateral prefrontal cortex) rather than the default mode network's rumination loop. Brain imaging shows that defusion exercises reduce activity in the medial prefrontal cortex (where self-referential rumination lives) and increase activity in regions associated with cognitive flexibility and perspective-taking.",
    whenToUse: [
      "When a thought keeps looping and won't stop",
      "When intrusive thoughts feel \"true\"",
      "At 3AM when your brain won't shut up",
      "When imposter syndrome thoughts hit",
      "When you're catastrophizing about the future",
    ],
    relatedSlugs: ["cognitive-restructuring", "cognitive-distortions"],
    faqs: [
      {
        q: "What's the difference between thought defusion and thought suppression?",
        a: "Thought suppression tries to push thoughts away (which makes them come back stronger). Defusion lets the thought exist but changes your relationship with it — you see it as just a thought, not a fact.",
      },
      {
        q: "Does thought defusion work for OCD intrusive thoughts?",
        a: "Yes, defusion is increasingly used alongside ERP (Exposure and Response Prevention) for OCD. It helps people recognize intrusive thoughts as mental noise rather than meaningful signals that require action.",
      },
      {
        q: "What if the thought still feels true after defusion?",
        a: "That's okay and expected. Defusion isn't about making thoughts feel false — it's about creating enough space that the thought doesn't control your behavior. Over time, the emotional charge diminishes.",
      },
    ],
    steps: [
      {
        title: "Catch the Thought",
        instruction:
          "What thought is bothering you right now? Write it down exactly as your mind says it. Don't filter it or clean it up.",
        type: "text-input",
        placeholder: "The thought that's stuck in my head is...",
      },
      {
        title: "Reframe It",
        instruction:
          "Now take that same thought and put it in this frame: \"I'm having the thought that...\" Notice how adding those words creates a tiny bit of distance. You're not the thought — you're the person noticing the thought.",
        type: "reflection",
      },
      {
        title: "Add More Distance",
        instruction:
          "Now try: \"I notice that I'm having the thought that...\" Feel the difference? Each layer creates more space between you and the thought.",
        type: "reflection",
      },
      {
        title: "Silly Voice Exercise",
        instruction:
          "Now say the original thought in a silly voice — a cartoon character, a movie villain, or a robotic monotone. Pick a voice:",
        type: "choice",
        options: [
          "Cartoon character voice",
          "Movie villain voice",
          "Robot monotone voice",
          "Singing opera voice",
        ],
      },
      {
        title: "Leaves on a Stream",
        instruction:
          "Close your eyes for 30 seconds. Imagine you're sitting by a gently flowing stream. Each time a thought comes, place it on a leaf and watch it float downstream. Don't push the leaves — just let them go at their own pace.",
        type: "timer",
        duration: 30,
      },
      {
        title: "Check In",
        instruction:
          "How fused do you feel with the original thought now? (1 = it's just background noise, 10 = it still feels completely true)",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 5. COGNITIVE RESTRUCTURING ─────────────────────────────────────
  {
    slug: "cognitive-restructuring",
    title: "Cognitive Restructuring: Challenge Negative Thought Patterns",
    metaTitle:
      "Cognitive Restructuring: Challenge Negative Thoughts | CBT Thought Record",
    metaDescription:
      "Use cognitive restructuring to challenge and reframe negative thought patterns. This guided CBT thought record exercise helps you build balanced thinking habits.",
    keywords:
      "cognitive restructuring, CBT thought record, challenge negative thoughts",
    subtitle:
      "For negative thinking patterns, self-criticism, and emotional distortion",
    time: "8 minutes",
    modality: "CBT",
    origin:
      "Developed by Aaron Beck, the founder of Cognitive Behavioral Therapy, as a core technique for identifying and changing distorted thinking patterns.",
    whatThisIs:
      "Cognitive restructuring is the backbone of Cognitive Behavioral Therapy (CBT) — the most studied and validated form of psychotherapy in the world. The core idea is simple but profound: it's not events that cause your emotional suffering, it's your interpretation of events. The same situation can make one person anxious and another person excited, depending on the thoughts each person has about it.\n\nThis technique walks you through a structured process called a \"thought record\" — a tool therapists have used for decades to help people identify, examine, and reframe distorted thinking. You'll identify a triggering situation, notice the automatic thought your brain generated, examine the evidence for and against that thought, and arrive at a more balanced perspective.\n\nCognitive restructuring isn't about positive thinking or pretending everything is fine. It's about accurate thinking. Your brain is fast but sloppy, and it often jumps to conclusions that are exaggerated, one-sided, or flat-out wrong. This exercise trains you to slow down and think like a scientist — examining the evidence before accepting your brain's first draft as truth.",
    neuroscience:
      "Cognitive restructuring strengthens prefrontal cortex regulation over the amygdala. Each time you actively challenge a distorted thought, you build new neural pathways that make balanced thinking more automatic over time. Brain imaging studies show that successful CBT literally changes brain activity patterns — reducing amygdala reactivity and increasing prefrontal engagement. This is neuroplasticity in action: you are physically rewiring your brain's response to triggers.",
    whenToUse: [
      "When you notice all-or-nothing thinking",
      "When a situation triggers strong negative emotions",
      "During conflict when you're only seeing one side",
      "When self-criticism feels overwhelming",
      "When you're making assumptions about what others think",
    ],
    relatedSlugs: ["cognitive-distortions", "thought-defusion"],
    faqs: [
      {
        q: "How is cognitive restructuring different from positive thinking?",
        a: "Positive thinking ignores reality. Cognitive restructuring examines it. The goal isn't to replace negative thoughts with positive ones — it's to replace distorted thoughts with accurate, balanced ones that account for all the evidence.",
      },
      {
        q: "How long does it take for cognitive restructuring to work?",
        a: "Many people notice a shift within a single session. However, building automatic balanced thinking habits typically takes 6-12 weeks of regular practice. Each time you complete a thought record, you strengthen the neural pathways for balanced thinking.",
      },
      {
        q: "Can I do cognitive restructuring on my own without a therapist?",
        a: "Yes. While a therapist can guide you through complex patterns, thought records are designed as a self-help tool. Many people successfully use them independently. If you find certain thoughts very resistant to change, a therapist can help.",
      },
      {
        q: "What if I can't find evidence against my negative thought?",
        a: "Try asking: \"What would I say to a friend in this situation?\" or \"Will this matter in 5 years?\" Often the evidence against a thought exists but is hard to see when you're emotionally activated. This is normal and gets easier with practice.",
      },
    ],
    steps: [
      {
        title: "The Situation",
        instruction:
          "What happened? Describe the specific situation that triggered your negative feelings. Be factual — stick to what a video camera would capture.",
        type: "text-input",
        placeholder: "Describe what happened...",
      },
      {
        title: "The Automatic Thought",
        instruction:
          "What went through your mind? What was the first thought or interpretation your brain jumped to? Write it exactly as it appeared in your head.",
        type: "text-input",
        placeholder: "My automatic thought was...",
      },
      {
        title: "The Emotion",
        instruction:
          "What emotion did that thought create? Name it, then rate its intensity from 1 to 10.",
        type: "multi-input",
        fields: ["The emotion I felt was...", "Intensity (1-10):"],
      },
      {
        title: "Evidence FOR the Thought",
        instruction:
          "What evidence supports this thought? Be honest — sometimes there IS some evidence. Write down the facts (not feelings) that support it.",
        type: "text-input",
        placeholder: "Evidence that supports this thought...",
      },
      {
        title: "Evidence AGAINST the Thought",
        instruction:
          "Now — what evidence goes against this thought? Think about past experiences, what others might say, facts you might be ignoring, or times when the opposite was true.",
        type: "text-input",
        placeholder: "Evidence against this thought...",
      },
      {
        title: "The Balanced Thought",
        instruction:
          "Taking ALL the evidence into account, write a more balanced, accurate version of the original thought. This isn't about being positive — it's about being fair.",
        type: "text-input",
        placeholder: "A more balanced thought would be...",
      },
      {
        title: "Re-rate the Emotion",
        instruction:
          "Think about the balanced thought you just wrote. Now re-rate the intensity of the original emotion. Has it shifted?",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 6. PROGRESSIVE MUSCLE RELAXATION ───────────────────────────────
  {
    slug: "progressive-muscle-relaxation",
    title: "Progressive Muscle Relaxation: A Full Guided Exercise",
    metaTitle:
      "Progressive Muscle Relaxation: Full Guided PMR Exercise",
    metaDescription:
      "Follow this guided progressive muscle relaxation exercise to release tension and stress from your body. A clinically proven technique for anxiety, insomnia, and pain.",
    keywords:
      "progressive muscle relaxation, PMR, muscle tension relief",
    subtitle: "For physical tension, insomnia, stress headaches, and anxiety",
    time: "12 minutes",
    modality: "Somatic",
    origin:
      "Created by physician Edmund Jacobson in the 1930s after discovering the connection between muscle tension and mental anxiety.",
    whatThisIs:
      "Progressive Muscle Relaxation (PMR) is a body-based technique that systematically releases physical tension you might not even know you're carrying. The method is simple: you deliberately tense a muscle group for a few seconds, then release it and notice the contrast. You work through your whole body from hands to feet (or vice versa), and by the end, your entire body feels loose and calm.\n\nDr. Edmund Jacobson developed PMR in the 1930s based on a key insight: physical tension and mental anxiety are two sides of the same coin. You can't have a relaxed body and an anxious mind at the same time. By systematically releasing muscle tension, you send a flood of \"all clear\" signals to your brain, which then dials down the stress response.\n\nPMR is one of the most studied relaxation techniques in clinical psychology. It's been shown to reduce anxiety, improve sleep quality, lower blood pressure, decrease headache frequency, and even reduce chronic pain. It's especially powerful for people who \"carry stress in their body\" — clenched jaws, tight shoulders, knotted stomachs. If that sounds like you, this exercise is going to feel like a full-body reset.",
    neuroscience:
      "Systematic tensing and releasing interrupts the stress-tension feedback loop. When muscles release, proprioceptors send safety signals to the brain. The contrast between tension and relaxation trains your nervous system to recognize and release holding patterns. Research shows PMR decreases cortisol, reduces sympathetic nervous system activity, and increases parasympathetic tone. Regular practice actually recalibrates your baseline muscle tension level.",
    whenToUse: [
      "Before bed when your body won't relax",
      "When you carry stress in your shoulders or jaw",
      "After a high-intensity mental workout",
      "When you've been sitting at a desk all day",
      "During or after a tension headache",
    ],
    relatedSlugs: ["body-scan", "box-breathing"],
    faqs: [
      {
        q: "How is PMR different from a body scan?",
        a: "A body scan is passive — you observe sensations without changing them. PMR is active — you deliberately tense and release muscles. Both are effective; PMR works better for people who carry a lot of physical tension, while body scans are better for building body awareness.",
      },
      {
        q: "Can progressive muscle relaxation help with insomnia?",
        a: "Yes. Multiple studies show PMR significantly improves sleep onset and quality. The physical relaxation response directly counteracts the muscle tension that keeps many people awake. Try it lying in bed as part of your sleep routine.",
      },
      {
        q: "Should I tense muscles that are already in pain?",
        a: "No. Skip any area that's injured or in acute pain. You can still relax those muscles on the release phase without tensing first. The technique works even if you skip certain muscle groups.",
      },
      {
        q: "How often should I practice PMR?",
        a: "For best results, practice daily for 2-3 weeks. Most people notice significant improvements in their baseline tension level within 1-2 weeks. After that, use it as needed.",
      },
    ],
    steps: [
      {
        title: "Get Ready",
        instruction:
          "Lie down or sit comfortably. Close your eyes. Take three slow, deep breaths. For each muscle group, you'll tense for about 5 seconds, then release for 10 seconds. Focus on the contrast between tension and relaxation.",
        type: "reflection",
      },
      {
        title: "Hands & Forearms",
        instruction:
          "Make tight fists with both hands. Squeeze as hard as you can. Feel the tension in your hands and forearms. Hold... hold... now release. Let your hands fall open like they're melting. Notice the warm, heavy feeling of relaxation flooding in.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Biceps",
        instruction:
          "Bend your arms and flex your biceps as hard as you can — like you're showing off your muscles. Feel the tension in your upper arms. Hold... hold... now release. Let your arms drop to your sides. Feel them getting heavy and warm.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Shoulders",
        instruction:
          "Raise your shoulders up toward your ears as high as they'll go. Feel the tension building in your shoulders and neck. Hold... hold... now let them drop. Let all that tension just fall away.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Face",
        instruction:
          "Scrunch up your entire face — squeeze your eyes shut, wrinkle your nose, clench your jaw. Like you just tasted something incredibly sour. Hold... hold... now release. Smooth out your forehead, let your jaw hang slightly open.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Chest & Stomach",
        instruction:
          "Take a deep breath and hold it while tightening your chest and stomach muscles. Make your core as hard as you can. Hold... hold... now exhale and release everything. Feel your torso soften and sink into whatever you're resting on.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Thighs",
        instruction:
          "Press your thighs together and tighten your quadriceps. Feel the tension through your upper legs. Hold... hold... now release. Let your legs fall slightly apart and feel the warmth spreading through them.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Calves",
        instruction:
          "Point your toes toward the ceiling, pulling them back toward your shins. Feel the stretch and tension in your calves. Hold... hold... now release. Let your feet fall naturally.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Feet",
        instruction:
          "Curl your toes tightly, like you're trying to pick up a marble with your feet. Feel the tension in the soles and arches. Hold... hold... now release. Spread your toes out and let your feet relax completely.",
        type: "timer",
        duration: 15,
      },
      {
        title: "Full Body Release",
        instruction:
          "Now scan through your whole body. If any area is still holding tension, take a breath and send the exhale there. Your body should feel heavy, warm, and loose. Stay here as long as you'd like.",
        type: "timer",
        duration: 30,
      },
    ],
  },

  // ─── 7. BODY SCAN (Updated) ──────────────────────────────────────────────────
  {
    slug: "body-scan",
    title: "Reconnecting With Your Body: A Guided Body Scan Practice",
    metaTitle:
      "Body Scan Meditation: Reconnect With Your Body | Guided Practice",
    metaDescription:
      "Feeling disconnected from your body? This guided body scan meditation helps you rebuild the mind-body connection, reduce stress, and process emotions stored in the body.",
    keywords:
      "body scan meditation, body scan exercise, mindfulness body scan, reconnect with body",
    subtitle:
      "For disconnection from body, stress, undefined emotions, and sleep",
    time: "10 minutes",
    modality: "MBSR/Mindfulness",
    origin:
      "Developed by Jon Kabat-Zinn as part of the Mindfulness-Based Stress Reduction (MBSR) program at UMass Medical Center.",
    whatThisIs:
      "A body scan is a mindfulness meditation where you move your attention slowly through different parts of your body, noticing whatever sensations are present without trying to change them. Unlike progressive muscle relaxation (which actively tenses and releases muscles), a body scan is purely observational — you're just paying attention.\n\nThis might sound simple, but simple is often what makes it usable. Jon Kabat-Zinn developed the body scan as part of Mindfulness-Based Stress Reduction (MBSR), a program studied across many settings. Research suggests body-scan style practices can help with stress, body awareness, and emotional regulation for many people, though effects vary and it is not a cure-all.\n\nMany of us live \"from the neck up\" — completely disconnected from the signals our body is sending. A body scan helps rebuild that connection. You might discover you've been clenching your jaw for hours, that your stomach is tight with anxiety, or that your shoulders are up by your ears. This awareness is often the first step toward softening patterns of tension you didn't even notice.",
    neuroscience:
      "Body-scan practice is often framed as interoceptive training — getting better at noticing internal signals like tension, breath, warmth, numbness, or ease. Regular mindfulness practice has been associated with changes in attention and self-awareness networks, but the useful point is simpler: shifting attention from abstract worry toward direct bodily sensation can reduce rumination and help you feel more present.",
    whenToUse: [
      "When you feel disconnected from your body",
      "Before sleep to release the day",
      "When emotions feel overwhelming but undefined",
      "After a stressful workday",
      "When you need to check in with yourself",
    ],
    relatedSlugs: ["progressive-muscle-relaxation", "54321-grounding"],
    faqs: [
      {
        q: "What if I fall asleep during a body scan?",
        a: "That's completely fine, especially if you're using it before bed. If you want to stay awake for the full practice, try sitting upright or keeping your eyes slightly open. Falling asleep just means your body needed rest.",
      },
      {
        q: "What if I don't feel any sensations?",
        a: "That's normal, especially when you're starting out. Numbness or lack of sensation is itself a valid observation. With practice, you'll develop greater sensitivity to subtle body signals.",
      },
      {
        q: "How is a body scan different from meditation?",
        a: "A body scan is a form of meditation — specifically, a guided attention practice. Unlike breath meditation (where you focus on one thing), the body scan moves your attention systematically through your body, making it easier for beginners.",
      },
    ],
    steps: [
      {
        title: "Settle In",
        instruction:
          "Find a comfortable position, ideally lying down. Close your eyes. Take three deep breaths, letting each exhale be a little longer than the inhale. With each exhale, let your body sink a little deeper into the surface beneath you.",
        type: "reflection",
      },
      {
        title: "Scan Your Body",
        instruction:
          "We'll move slowly from your feet to the top of your head. For each region, simply notice what's there — warmth, tension, tingling, numbness, nothing at all. No need to change anything. Just observe.",
        type: "body-scan",
        regions: [
          "Feet and toes",
          "Lower legs and knees",
          "Upper legs and hips",
          "Lower back and abdomen",
          "Chest and upper back",
          "Hands and arms",
          "Shoulders and neck",
          "Head and face",
        ],
      },
      {
        title: "Whole Body Awareness",
        instruction:
          "Now expand your awareness to your whole body at once. Feel it as a single, complete living thing. Breathing. Present. Here. Sit with this feeling for a moment.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Gently Return",
        instruction:
          "Begin to bring gentle movement back — wiggle your fingers and toes. Take a deep breath. When you're ready, open your eyes slowly. Carry this awareness with you.",
        type: "reflection",
      },
    ],
  },

  // ─── 8. TIPP SKILL ─────────────────────────────────────────────────
  {
    slug: "tipp-skill",
    title: "The TIPP Skill: DBT's Emergency Emotion Regulation Technique",
    metaTitle:
      "TIPP Skill: DBT's Emergency Emotion Regulation Technique",
    metaDescription:
      "Learn the TIPP skill from DBT to rapidly regulate extreme emotions. Temperature, Intense exercise, Paced breathing, and Progressive relaxation explained.",
    keywords: "TIPP skill DBT, TIPP technique, crisis coping skill",
    subtitle:
      "For emotional crises, rage, overwhelming panic, and extreme distress",
    time: "6 minutes",
    modality: "DBT",
    origin:
      "Developed by Marsha Linehan as part of the Distress Tolerance module in Dialectical Behavior Therapy (DBT).",
    whatThisIs:
      "TIPP is DBT's emergency protocol for when emotions are at crisis level — we're talking 8, 9, or 10 out of 10 intensity. It stands for Temperature, Intense exercise, Paced breathing, and Progressive relaxation. Each letter represents a body-based intervention that can help bring intensity down quickly.\n\nThis isn't a subtle technique. When you're in emotional crisis, you often need something practical, fast, and physical. Cold water, brief intense movement, and breathing changes are blunt instruments by design. They do not solve the whole situation; they help get you back to a state where thinking becomes possible again.\n\nMarsha Linehan, who created DBT, designed TIPP specifically for moments when you can't think your way out of an emotion. When rage, panic, or despair is so intense that cognitive techniques feel unreachable, TIPP gives you a physiological reset you can use right away.",
    neuroscience:
      "The TIPP skills work through several fast body-based pathways. Cold facial temperature can trigger a dive-response pattern that helps some people downshift quickly. Brief intense movement gives high physiological activation somewhere to go. Paced breathing and progressive relaxation can help lower arousal and make it easier to think clearly again.",
    whenToUse: [
      "During a crisis moment when emotions are at 8+/10",
      "When you're about to say something you'll regret",
      "When rage or panic is overwhelming",
      "After receiving devastating news",
      "When you need an emotional reset immediately",
    ],
    relatedSlugs: ["box-breathing", "vagal-toning"],
    faqs: [
      {
        q: "What does TIPP stand for in DBT?",
        a: "TIPP stands for Temperature (cold water on face), Intense exercise (brief burst of activity), Paced breathing (slow, rhythmic breathing), and Progressive relaxation (systematic muscle release). Each targets a different physiological pathway to reduce extreme emotions.",
      },
      {
        q: "Is the cold water step safe for everyone?",
        a: "The cold water step is safe for most people, but those with heart conditions, extremely low blood pressure, or eating disorders (particularly bradycardia) should consult a doctor first. The dive reflex significantly slows heart rate.",
      },
      {
        q: "Can I use TIPP at work or in public?",
        a: "You can adapt it. For temperature, hold a cold water bottle or ice cube. For intense exercise, do wall push-ups in a bathroom. Paced breathing and progressive relaxation can be done anywhere discreetly.",
      },
      {
        q: "How quickly does TIPP work?",
        a: "Many people feel some downshift during the temperature or breathing steps within seconds to minutes. The full protocol takes about 5-6 minutes, and the goal is not perfect calm — it is enough reduction in intensity to help you regain choice.",
      },
    ],
    steps: [
      {
        title: "Rate Your Distress",
        instruction:
          "How intense are your emotions right now? Rate from 1 (calm) to 10 (crisis level). TIPP is designed for moments when you're at 7 or above.",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "T — Temperature",
        instruction:
          "Get something cold — splash cold water on your face, hold ice cubes, put a cold pack on your cheeks and forehead. For many people, cold facial temperature helps the body downshift quickly. Do this for 30 seconds.",
        type: "timer",
        duration: 30,
      },
      {
        title: "I — Intense Exercise",
        instruction:
          "Do 60 seconds of intense physical activity. Jumping jacks, running in place, push-ups, burpees — anything that gets your heart pumping. The goal is to give that surge of activation somewhere to go.",
        type: "timer",
        duration: 60,
      },
      {
        title: "P — Paced Breathing",
        instruction:
          "Now slow everything down with paced breathing. Inhale for 4 counts, hold for 6 counts, exhale for 8 counts. The long exhale activates your parasympathetic nervous system.",
        type: "breathing",
        breathe: { inhale: 4, hold: 6, exhale: 8 },
        duration: 72,
      },
      {
        title: "P — Progressive Relaxation",
        instruction:
          "Starting from your feet, work up through your body. Tense each area for 5 seconds, then release. Feet... calves... thighs... stomach... chest... arms... shoulders... face. Let each area go completely limp.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Re-rate Your Distress",
        instruction:
          "How intense are your emotions now? Compare to where you started.",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 9. BEHAVIORAL ACTIVATION ───────────────────────────────────────
  {
    slug: "behavioral-activation",
    title: "Behavioral Activation: Start Moving When You Can't Find Motivation",
    metaTitle:
      "Behavioral Activation: How to Start When You Have No Motivation",
    metaDescription:
      "Use behavioral activation to break the depression-inactivity cycle. This guided exercise helps you take one small step when motivation feels impossible to find.",
    keywords:
      "behavioral activation, depression activity, no motivation help",
    subtitle:
      "For depression, low motivation, feeling stuck, and loss of interest",
    time: "5 minutes",
    modality: "CBT/Behavioral",
    origin:
      "Developed as a component of CBT for depression and later studied as a standalone treatment approach.",
    whatThisIs:
      "Behavioral activation is built on one of the most counterintuitive truths in psychology: motivation often follows action, not the other way around. When you're depressed or stuck, your brain tells you to wait until you \"feel like\" doing something. But that feeling often never arrives — because inactivity can deepen low mood, which then makes action feel even harder.\n\nBehavioral activation breaks this cycle by flipping the script. Instead of waiting to feel motivated, you take a tiny action first and let momentum catch up. It's not about doing something huge — it's about doing something small enough that even at your lowest, you can manage it. Make your bed. Send one text. Walk to the mailbox. The action itself can create a little more structure, contact, or accomplishment, which can make the next step easier.\n\nBehavioral activation has a strong evidence base and is widely used as a real treatment approach for depression. The key insight is practical: behavior can influence mood, even when your mood is telling you not to begin.",
    neuroscience:
      "Depression can make effort, reward, and anticipation feel blunted. Behavioral activation works with that reality by reducing the size of the first step and rebuilding contact with structure, accomplishment, and pleasure over time. The useful takeaway is not a single dopamine story, but that repeated small actions can slowly retrain expectation and momentum.",
    whenToUse: [
      "When you can't get out of bed",
      "When everything feels pointless",
      "When you've been scrolling for hours",
      "When depression makes every task feel impossible",
      "When you've lost interest in things you used to enjoy",
    ],
    relatedSlugs: ["values-clarification", "self-compassion-break"],
    faqs: [
      {
        q: "What if I don't have the energy for behavioral activation?",
        a: "That's exactly when it's most useful. Start impossibly small — sit up in bed, drink a glass of water, open a window. The technique is designed for zero-motivation states. Any action counts.",
      },
      {
        q: "How is behavioral activation different from \"just do it\"?",
        a: "\"Just do it\" implies willpower and effort. Behavioral activation is a structured, clinical technique that starts with tiny actions, tracks mood changes, and builds gradually. It's evidence-based and designed with compassion for how depression actually works.",
      },
      {
        q: "Can behavioral activation replace antidepressants?",
        a: "Behavioral activation is an evidence-based treatment for depression, but medication decisions belong with you and your clinician. For some people it may be enough on its own; for others, combined care is more helpful.",
      },
    ],
    steps: [
      {
        title: "Rate Your Current Mood",
        instruction:
          "How are you feeling right now? 1 = worst, 10 = best. Be honest — this isn't a test. We just need a starting point.",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Pick One Tiny Action",
        instruction:
          "Choose ONE small thing you can do in the next 5 minutes. The smaller, the better. Not \"clean the house\" — more like \"put one dish in the sink.\" What's your micro-action?",
        type: "text-input",
        placeholder: "My tiny action is...",
      },
      {
        title: "Predict Your Mood",
        instruction:
          "How do you think you'll feel AFTER doing this action? (1-10) Depression's trick is making you predict you'll feel nothing — notice if that's happening.",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Do It Now",
        instruction:
          "Go do the action right now. It doesn't have to be perfect. It doesn't have to be done well. It just has to be done. Come back when you're finished.",
        type: "timer",
        duration: 300,
      },
      {
        title: "Rate Your Actual Mood",
        instruction:
          "You did it. How do you actually feel now? (1-10)",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Compare",
        instruction:
          "Look at the difference between your prediction and reality. Most people underestimate how they'll feel afterward. Depression lies about what will help. This exercise proves it. Even if the shift was small, you just broke the cycle — and that matters more than you think.",
        type: "reflection",
      },
    ],
  },

  // ─── 10. COGNITIVE DISTORTIONS ──────────────────────────────────────
  {
    slug: "cognitive-distortions",
    title:
      "10 Cognitive Distortions: Identify the Thinking Traps That Keep You Stuck",
    metaTitle:
      "10 Cognitive Distortions: Identify Your Thinking Traps | CBT Guide",
    metaDescription:
      "Learn the 10 cognitive distortions from CBT that distort your thinking. Identify which thinking traps you fall into and learn to challenge them with this guided exercise.",
    keywords:
      "cognitive distortions list, thinking errors, CBT distortions",
    subtitle:
      "For automatic negative thoughts, thinking errors, and distorted beliefs",
    time: "6 minutes",
    modality: "CBT",
    origin:
      "Catalogued by David Burns in \"Feeling Good: The New Mood Therapy,\" building on Aaron Beck's cognitive therapy framework.",
    whatThisIs:
      "Cognitive distortions are systematic errors in thinking that your brain makes automatically. They're like bugs in your mental software — patterns that feel completely logical in the moment but are actually skewing reality in predictable, unhelpful ways. Everyone has them. They're not a sign of weakness or mental illness; they're a byproduct of how human brains evolved to prioritize speed over accuracy.\n\nDavid Burns identified 10 common cognitive distortions in his groundbreaking book \"Feeling Good\" — which has sold over 5 million copies and is one of the most prescribed books by therapists worldwide. These 10 patterns include things like all-or-nothing thinking (\"If it's not perfect, it's a failure\"), catastrophizing (\"This is going to be a disaster\"), and emotional reasoning (\"I feel like a fraud, so I must be one\").\n\nLearning to spot these distortions is like getting a cheat sheet for your own brain. Once you can name the pattern, it loses much of its power. Instead of \"I'm a failure,\" you can say \"That's all-or-nothing thinking\" — and suddenly you've created space between the thought and your response to it.",
    neuroscience:
      "The brain is a pattern-completion machine that prioritizes speed over accuracy. Cognitive distortions are systematic shortcuts in that system — fast, familiar interpretations that can feel true even when they are incomplete or skewed. Learning to label a pattern can create useful distance from it, and affect-labeling research suggests that naming what is happening can reduce emotional intensity for many people.",
    whenToUse: [
      "When you use words like \"always\", \"never\", or \"should\"",
      "When you feel like a failure over one mistake",
      "When you assume the worst outcome is certain",
      "When you dismiss compliments or positive feedback",
      "When you take things personally that aren't about you",
    ],
    relatedSlugs: ["cognitive-restructuring", "thought-defusion"],
    faqs: [
      {
        q: "What are the most common cognitive distortions?",
        a: "The most frequently occurring are all-or-nothing thinking, catastrophizing, emotional reasoning, and \"should\" statements. Most people have 2-3 that they default to regularly. Identifying your personal patterns is the first step to changing them.",
      },
      {
        q: "Are cognitive distortions the same as logical fallacies?",
        a: "They're related but different. Logical fallacies are errors in formal reasoning. Cognitive distortions are automatic patterns in emotional thinking. You might be perfectly logical in a debate but still catastrophize about your own life.",
      },
      {
        q: "Can cognitive distortions be permanently fixed?",
        a: "They can't be eliminated entirely — they're a feature of human cognition. But you can dramatically reduce their impact by building the habit of catching and labeling them. Over time, the distorted thought loses its automatic grip.",
      },
      {
        q: "How are cognitive distortions different from cognitive restructuring?",
        a: "Cognitive distortions are the problem — the thinking errors themselves. Cognitive restructuring is the solution — the structured process for challenging and reframing those distorted thoughts. They work hand-in-hand.",
      },
    ],
    steps: [
      {
        title: "Catch a Thought",
        instruction:
          "Write down a negative thought that's been bothering you. Don't filter it — write it exactly as it appears in your mind.",
        type: "text-input",
        placeholder: "The thought that's bothering me is...",
      },
      {
        title: "The Distortion Detector",
        instruction:
          "Read through these 10 cognitive distortions and pick which one(s) apply to your thought:\n\n1. All-or-Nothing Thinking — Seeing things in black and white with no middle ground\n2. Overgeneralization — One bad event means everything is bad forever\n3. Mental Filter — Fixating on the negative and ignoring the positive\n4. Disqualifying the Positive — Dismissing good things as \"not counting\"\n5. Jumping to Conclusions — Mind-reading or fortune-telling without evidence\n6. Magnification/Minimization — Blowing up the bad, shrinking the good\n7. Emotional Reasoning — \"I feel it, therefore it must be true\"\n8. Should Statements — Rigid rules about how things \"should\" or \"must\" be\n9. Labeling — Attaching a fixed label to yourself or others based on one event\n10. Personalization — Taking responsibility for things that aren't your fault",
        type: "choice",
        options: [
          "All-or-Nothing Thinking",
          "Overgeneralization",
          "Mental Filter",
          "Disqualifying the Positive",
          "Jumping to Conclusions",
          "Magnification/Minimization",
          "Emotional Reasoning",
          "Should Statements",
          "Labeling",
          "Personalization",
        ],
      },
      {
        title: "Why This Distortion Fits",
        instruction:
          "In your own words, explain why this distortion applies to your thought. What specifically about your thinking is distorted?",
        type: "text-input",
        placeholder: "This distortion applies because...",
      },
      {
        title: "Reframe the Thought",
        instruction:
          "Now write a more balanced version of the original thought — one that accounts for the distortion you identified. Not a positive spin, but an accurate one.",
        type: "text-input",
        placeholder: "A more balanced thought would be...",
      },
      {
        title: "Reflection",
        instruction:
          "You just used one of the most powerful skills in CBT: the ability to name the distortion. Over time, this gets faster and more automatic. The distorted thought doesn't disappear, but it loses its power when you can see through it.",
        type: "reflection",
      },
    ],
  },

  // ─── 11. SELF-COMPASSION BREAK ──────────────────────────────────────
  {
    slug: "self-compassion-break",
    title:
      "Self-Compassion Break: A 3-Minute Practice for When You're Hard on Yourself",
    metaTitle:
      "Self-Compassion Break: 3-Minute Exercise for Self-Criticism",
    metaDescription:
      "Practice Kristin Neff's self-compassion break to quiet your inner critic. This 3-minute guided exercise helps you respond to suffering with kindness instead of judgment.",
    keywords:
      "self compassion exercise, self compassion meditation, kristin neff exercise",
    subtitle:
      "For self-criticism, imposter syndrome, comparison, and after failure",
    time: "3 minutes",
    modality: "Self-Compassion/Mindfulness",
    origin:
      "Developed by Dr. Kristin Neff, a pioneering researcher in self-compassion psychology at the University of Texas at Austin.",
    whatThisIs:
      "The self-compassion break is a simple three-step practice for moments when your inner critic is loudest — after a mistake, during imposter syndrome, when you're comparing yourself to others, or when you just can't stop beating yourself up. It was developed by Dr. Kristin Neff, one of the leading researchers on self-compassion.\n\nThe three steps are: mindfulness (acknowledging that this is a moment of suffering, without exaggerating or minimizing it), common humanity (remembering that suffering and imperfection are universal human experiences, not evidence that something is wrong with you), and self-kindness (treating yourself with the same warmth you'd offer a good friend).\n\nMost people are dramatically kinder to friends than to themselves. If a friend made a mistake, you wouldn't call them a worthless failure — you'd acknowledge their pain and encourage them. Self-compassion asks you to offer that same response to yourself. Research links self-compassion with resilience, steadier motivation, and lower distress, but the immediate goal is simpler: replace self-attack with a more workable response.",
    neuroscience:
      "Self-compassion practices are often described as shifting the body out of threat-focused self-attack and toward a more affiliative, soothing state. The exact hormone story varies across studies, so we keep the claim modest: self-compassion can reduce the intensity of self-criticism and help the nervous system settle enough for wiser action.",
    whenToUse: [
      "After making a mistake",
      "When imposter syndrome is loudest",
      "When you're comparing yourself to others",
      "After a rejection or failure",
      "When your inner critic won't stop",
    ],
    relatedSlugs: ["radical-acceptance", "behavioral-activation"],
    faqs: [
      {
        q: "Isn't self-compassion just making excuses?",
        a: "No — research consistently shows the opposite. Self-compassion increases personal responsibility and motivation. When you're not paralyzed by self-attack, you're more likely to acknowledge mistakes, learn from them, and try again.",
      },
      {
        q: "What's the difference between self-compassion and self-esteem?",
        a: "Self-esteem is about evaluating yourself positively (which requires outperforming or comparing). Self-compassion is about treating yourself kindly regardless of performance. Self-compassion provides emotional stability that self-esteem can't, because it doesn't depend on success.",
      },
      {
        q: "Why does self-compassion feel so uncomfortable at first?",
        a: "If you grew up being criticized, self-kindness can feel foreign or even threatening. Your brain may interpret it as dropping your guard. This is normal. Start small, and the discomfort lessens with practice.",
      },
    ],
    steps: [
      {
        title: "What's Happening",
        instruction:
          "What's causing you pain right now? Write down what happened or what you're struggling with. No judgment — just name it.",
        type: "text-input",
        placeholder: "What I'm struggling with right now is...",
      },
      {
        title: "Step 1: Mindfulness",
        instruction:
          "Place your hand on your heart. Say to yourself (out loud or silently): \"This is a moment of suffering.\" You can also use: \"This hurts\" or \"This is really hard right now.\" Just acknowledge what you're feeling without minimizing or dramatizing it.",
        type: "reflection",
      },
      {
        title: "Step 2: Common Humanity",
        instruction:
          "Now say: \"Suffering is a part of being human. I'm not alone in this.\" Remember that everyone struggles, everyone fails, everyone has moments of self-doubt. This pain — whatever it is — connects you to every other human being who has ever felt this way. You are not broken. You are human.",
        type: "reflection",
      },
      {
        title: "Step 3: Self-Kindness",
        instruction:
          "What would you say to a close friend going through this exact same thing? Write that message — but address it to yourself. Be warm, honest, and kind.",
        type: "text-input",
        placeholder: "Dear me...",
      },
      {
        title: "Carry It With You",
        instruction:
          "Read what you wrote one more time. You deserve the same kindness you give to others. Self-compassion isn't a one-time fix — it's a practice. And you just practiced it.",
        type: "reflection",
      },
    ],
  },

  // ─── 12. RADICAL ACCEPTANCE ─────────────────────────────────────────
  {
    slug: "radical-acceptance",
    title: "Radical Acceptance: How to Stop Fighting What You Can't Control",
    metaTitle:
      "Radical Acceptance: Stop Fighting What You Can't Control | DBT",
    metaDescription:
      "Learn radical acceptance from DBT to stop suffering over things you cannot change. This guided exercise helps you find peace by accepting reality as it is right now.",
    keywords:
      "radical acceptance DBT, radical acceptance technique, accept what you can't change",
    subtitle:
      "For things you can't change, loss, unfairness, and resistance to reality",
    time: "7 minutes",
    modality: "DBT",
    origin:
      "Developed by Marsha Linehan as a core Distress Tolerance skill in Dialectical Behavior Therapy (DBT), drawing from Zen Buddhist principles.",
    whatThisIs:
      "Radical acceptance is the practice of fully accepting reality as it is — not as you wish it were, not as it \"should\" be, but as it actually is in this moment. The word \"radical\" means complete and total. It doesn't mean you approve of what happened or that you won't work to change things in the future. It means you stop fighting the reality that already exists.\n\nMarsha Linehan, who created DBT, described the formula like this: Pain + Non-acceptance = Suffering. Pain is inevitable — loss, rejection, unfairness, illness. But suffering is what happens when you add resistance on top of pain. The thoughts that say \"this shouldn't be happening\" or \"why me\" or \"it's not fair\" — these don't change reality; they just layer extra suffering onto an already painful situation.\n\nRadical acceptance is one of the hardest skills in therapy to practice, because everything in you wants to protest. But it's also one of the most liberating. When you stop spending energy fighting what you can't change, you free up enormous cognitive and emotional resources to work on what you can change. Acceptance isn't giving up — it's redirecting your energy from futile resistance to purposeful action.",
    neuroscience:
      "Resistance to reality activates the anterior cingulate cortex's conflict monitoring system, creating ongoing distress. The brain detects a mismatch between \"what is\" and \"what should be\" and generates a continuous error signal that manifests as suffering. Radical acceptance deactivates this conflict loop, reducing the brain's stress response and freeing up cognitive resources in the prefrontal cortex for problem-solving what you CAN change.",
    whenToUse: [
      "When you keep thinking \"this shouldn't be happening\"",
      "After a breakup or loss",
      "When a situation is truly beyond your control",
      "When anger at unfairness is consuming you",
      "When you're stuck wishing things were different",
    ],
    relatedSlugs: ["self-compassion-break", "values-clarification"],
    faqs: [
      {
        q: "Does radical acceptance mean I approve of what happened?",
        a: "No. Acceptance and approval are completely different. You can accept that something happened while still believing it was wrong, unfair, or harmful. Acceptance just means you stop denying the reality of it.",
      },
      {
        q: "How is radical acceptance different from giving up?",
        a: "Giving up means you stop trying to improve your situation. Radical acceptance means you stop fighting the reality that already exists so you can redirect energy toward what you CAN change. It's the opposite of giving up — it's strategic.",
      },
      {
        q: "Why is radical acceptance so hard?",
        a: "Because your brain is wired to solve problems, and accepting painful realities feels like surrendering. It also requires feeling the full pain of a situation rather than numbing it with resistance. This takes practice and often feels worse briefly before it feels better.",
      },
      {
        q: "Can I practice radical acceptance for trauma?",
        a: "Yes, but trauma-related radical acceptance is best done with a therapist's support, especially initially. The skill is the same, but the emotional intensity may require professional guidance.",
      },
    ],
    steps: [
      {
        title: "Name What You're Fighting",
        instruction:
          "What reality are you struggling to accept? Write it as a simple, factual statement — no editorializing, no \"should\" or \"shouldn't.\" Just what IS.",
        type: "text-input",
        placeholder: "The reality I'm fighting is...",
      },
      {
        title: "Notice the Resistance",
        instruction:
          "What does your resistance feel like? Where do you feel it in your body? What thoughts does your mind generate to fight this reality? (\"It's not fair,\" \"This shouldn't have happened,\" \"Why me?\")",
        type: "text-input",
        placeholder: "My resistance shows up as...",
      },
      {
        title: "What's in Your Control?",
        instruction:
          "Looking at this situation, separate what's in your control from what isn't. Be brutally honest.",
        type: "multi-input",
        fields: [
          "What I CANNOT control:",
          "What I CAN control:",
        ],
      },
      {
        title: "Practice Acceptance Statements",
        instruction:
          "Choose the acceptance statement that resonates most with you right now and say it to yourself — out loud if possible:",
        type: "choice",
        options: [
          "This is what happened. I can't change the past.",
          "I don't have to like it. I just have to stop fighting it.",
          "Fighting this reality only adds suffering to my pain.",
          "I accept this moment exactly as it is.",
          "I can accept what is and still work toward what I want.",
        ],
      },
      {
        title: "Commit to Respond, Not React",
        instruction:
          "Now that you've acknowledged what you can't control, what's one thing you CAN do to move forward? Not to fix what happened, but to respond purposefully to what's next.",
        type: "text-input",
        placeholder: "One thing I can do to move forward is...",
      },
      {
        title: "Let It Be",
        instruction:
          "Take a deep breath. Acceptance isn't a one-time event — it's something you may need to practice again and again for the same situation. That's normal. Each time you choose acceptance over resistance, you suffer a little less. And that's enough.",
        type: "reflection",
      },
    ],
  },

  // ─── 13. VAGAL TONING ──────────────────────────────────────────────
  {
    slug: "vagal-toning",
    title: "Vagus Nerve Exercises: How to Activate Your Body's Calm Response",
    metaTitle:
      "Vagus Nerve Exercises: Activate Your Body's Natural Calm Response",
    metaDescription:
      "Try these vagus nerve stimulation exercises to activate your parasympathetic nervous system naturally. Reduce anxiety and stress with cold exposure, humming, and stretching.",
    keywords:
      "vagus nerve exercises, vagal toning, vagus nerve stimulation natural",
    subtitle:
      "For background anxiety, nervous system dysregulation, and feeling \"on edge\"",
    time: "4 minutes",
    modality: "Polyvagal/Somatic",
    origin:
      "Based on Stephen Porges' Polyvagal Theory, which maps how the vagus nerve governs our sense of safety, connection, and stress response.",
    whatThisIs:
      "Your vagus nerve is the longest nerve in your body — it runs from your brainstem all the way down to your gut, connecting your brain to your heart, lungs, digestive system, and other major organs. It's the main communication highway of your parasympathetic nervous system, which is responsible for the \"rest and digest\" state. When your vagus nerve is well-toned, you recover from stress faster, regulate emotions more effectively, and feel calmer at baseline.\n\nVagal toning exercises are simple physical practices that stimulate this nerve and shift your nervous system from \"fight or flight\" toward \"rest and digest.\" The three exercises in this practice — cold exposure, humming, and gentle neck stretches — each activate the vagus nerve through different pathways. Cold water triggers the dive reflex. Humming and chanting vibrate the vocal cords, which sit right next to the vagus nerve. Neck stretches release the muscles surrounding it.\n\nThink of vagal toning like exercise for your nervous system. The more you practice, the higher your vagal tone becomes, which means better stress resilience, improved emotional regulation, and a calmer baseline state. It's one of the most underappreciated tools for mental health.",
    neuroscience:
      "The vagus nerve is the primary communication highway between body and brain, carrying 80% of information from body to brain (not the other way around). Vagal toning exercises stimulate this nerve, shifting the autonomic nervous system from sympathetic activation to parasympathetic rest-and-digest. Higher vagal tone — measured by heart rate variability (HRV) — is associated with better emotional regulation, reduced inflammation, improved stress resilience, and lower risk of cardiovascular disease. These exercises increase vagal tone both acutely and over time with regular practice.",
    whenToUse: [
      "When you feel activated but don't know why",
      "As a morning reset before starting the day",
      "When anxiety is building but hasn't peaked yet",
      "After conflict to bring your nervous system back to baseline",
      "When you feel stuck in fight-or-flight",
    ],
    relatedSlugs: ["physiological-sigh", "tipp-skill"],
    faqs: [
      {
        q: "What is vagal tone and why does it matter?",
        a: "Vagal tone reflects how well your vagus nerve functions. Higher vagal tone means faster recovery from stress, better emotional regulation, and lower inflammation. It's measured through heart rate variability (HRV) — the variation in time between heartbeats.",
      },
      {
        q: "How often should I do vagus nerve exercises?",
        a: "For building vagal tone, daily practice is ideal — even just 2-3 minutes. For acute stress relief, use the exercises anytime you feel activated. Many people incorporate cold water exposure and humming into their morning routine.",
      },
      {
        q: "Can cold showers stimulate the vagus nerve?",
        a: "Yes. Cold water exposure is one of the most powerful vagal toning tools. Even splashing cold water on your face activates the dive reflex and stimulates the vagus nerve. Cold showers provide a more intense stimulus.",
      },
    ],
    steps: [
      {
        title: "Check In",
        instruction:
          "Before we start, notice your current state. How activated or stressed do you feel? Just take a mental snapshot — we'll compare after.",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Exercise 1: Cold Exposure",
        instruction:
          "Splash cold water on your face and the sides of your neck, or hold a cold object (ice pack, cold water bottle) against your cheeks and forehead. This triggers the dive reflex and directly activates your vagus nerve. Do this for 30 seconds.",
        type: "timer",
        duration: 30,
      },
      {
        title: "Exercise 2: Humming / Buzzing",
        instruction:
          "Take a deep breath in, then hum or buzz on the exhale — like a long \"hmmmmm\" or \"bzzzzz.\" Feel the vibration in your throat and chest. The vocal cord vibration directly stimulates the vagus nerve. Do 6 rounds.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Exercise 3: Gentle Neck Stretches",
        instruction:
          "Slowly tilt your right ear toward your right shoulder. Hold for 15 seconds and breathe. Then switch to the left side. The vagus nerve runs through the neck — gentle stretching releases the surrounding muscles and improves vagal signaling.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Check In Again",
        instruction:
          "How activated or stressed do you feel now? Compare to your starting point.",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 14. WORRY TIME ────────────────────────────────────────────────
  {
    slug: "worry-time",
    title: "Scheduled Worry Time: The CBT Technique That Contains Anxiety",
    metaTitle:
      "Scheduled Worry Time: CBT Technique to Contain Anxiety",
    metaDescription:
      "Use the scheduled worry time technique from CBT to contain anxiety to a set time period. Stop worries from consuming your entire day with this structured exercise.",
    keywords:
      "worry time technique, scheduled worry, CBT worry postponement",
    subtitle:
      "For generalized anxiety, persistent worry, racing thoughts, and focus problems",
    time: "10 minutes",
    modality: "CBT",
    origin:
      "Developed as part of CBT anxiety protocols, based on research showing that containment reduces worry frequency and intensity.",
    whatThisIs:
      "Scheduled worry time is a deceptively powerful CBT technique based on a counterintuitive idea: instead of trying to stop worrying (which usually makes it worse), you give yourself permission to worry — but only during a specific, time-limited window. For the rest of the day, when a worry pops up, you write it down and tell yourself: \"I'll deal with this during my worry time.\"\n\nThe technique works on multiple levels. First, it gives your brain the reassurance that worries won't be ignored — they'll get their time. This alone reduces the urgency your mind places on them. Second, research shows that when people revisit their worries during the scheduled time, up to 80% of them no longer feel pressing. The mere act of postponing a worry often dissolves it.\n\nDuring the worry time itself, you don't just spiral — you do structured processing. You dump all your worries out, categorize them as actionable or non-actionable, make concrete plans for the actionable ones, and practice releasing the rest. This transforms worry from an all-day background hum into a contained, productive 10-minute exercise.",
    neuroscience:
      "Worry activates the default mode network in an unproductive loop. Scheduling worry time gives the prefrontal cortex a \"promise\" that concerns will be addressed, reducing background anxiety through what researchers call the \"containment effect.\" When worries are revisited later, most have lost their urgency — this teaches the brain to deprioritize non-urgent threats. Over time, this retrains the brain's threat assessment system, reducing the frequency and intensity of spontaneous worry episodes.",
    whenToUse: [
      "When anxiety follows you through the whole day",
      "When you can't stop thinking about what might go wrong",
      "When worry is interfering with sleep",
      "When you're trying to focus but your mind keeps drifting to concerns",
      "When generalized anxiety disorder symptoms are high",
    ],
    relatedSlugs: ["cognitive-restructuring", "cognitive-distortions"],
    faqs: [
      {
        q: "When should I schedule my worry time?",
        a: "Choose a consistent daily time that's not right before bed (worry + sleep don't mix). Late afternoon works well for many people. Set a timer for 10-15 minutes maximum.",
      },
      {
        q: "What if I can't postpone my worries?",
        a: "This is a skill that improves with practice. Start by writing the worry down and telling yourself \"I'll address this at [time].\" Even partial postponement (worrying for 30 seconds instead of 30 minutes) is progress. The brain learns that postponed worries don't become catastrophes.",
      },
      {
        q: "Does worry time make anxiety worse by focusing on worries?",
        a: "Research shows the opposite. Structured worry time actually reduces overall daily anxiety by 35-50% in most studies. The key is the structure — you're not spiraling; you're processing and categorizing.",
      },
      {
        q: "Can worry time help with insomnia caused by anxiety?",
        a: "Yes. Doing your worry time in the afternoon or early evening gives your brain a chance to process concerns before bed. When nighttime worries pop up, you can tell yourself they'll be addressed tomorrow — and your brain believes it because you've built the habit.",
      },
    ],
    steps: [
      {
        title: "Set the Container",
        instruction:
          "You have 10 minutes. This is your dedicated worry time — the only time today you need to worry. Set a timer and let it all out.",
        type: "timer",
        duration: 10,
      },
      {
        title: "Brain Dump",
        instruction:
          "Write down everything you're worried about right now. Don't organize, don't judge, just dump. Big worries, small worries, irrational worries — all of them.",
        type: "text-input",
        placeholder: "All the things I'm worried about...",
      },
      {
        title: "Sort: Actionable vs. Not Actionable",
        instruction:
          "Look at your worry list. For each one, ask: \"Is there something concrete I can do about this in the next week?\" Separate them into two categories.",
        type: "multi-input",
        fields: [
          "ACTIONABLE worries (I can do something about these):",
          "NOT ACTIONABLE worries (I cannot control these):",
        ],
      },
      {
        title: "Plan for Actionable Worries",
        instruction:
          "For your actionable worries, write one concrete next step for each. Not the whole solution — just the very next thing you'd do.",
        type: "text-input",
        placeholder: "My next steps for actionable worries...",
      },
      {
        title: "Release Non-Actionable Worries",
        instruction:
          "For worries you can't control: read each one, take a breath, and say \"I'm choosing to let this go for today.\" You've acknowledged it. You've given it attention. Now it's time to set it down. If it comes back tomorrow, you'll address it in tomorrow's worry time.",
        type: "reflection",
      },
      {
        title: "Close the Container",
        instruction:
          "Worry time is over. You showed up, you processed, and you made plans where you could. For the rest of the day, if a worry pops up, write it down and save it for tomorrow's session. Your brain has learned it can trust the process.",
        type: "reflection",
      },
    ],
  },

  // ─── 15. VALUES CLARIFICATION ───────────────────────────────────────
  {
    slug: "values-clarification",
    title:
      "Values Clarification Exercise: Discover What Actually Matters to You",
    metaTitle:
      "Values Clarification Exercise: Discover What Matters | ACT",
    metaDescription:
      "Use this ACT values clarification exercise to discover what truly matters to you. Identify your core values and align your daily actions with what gives life meaning.",
    keywords:
      "values clarification exercise, ACT values, life values assessment",
    subtitle:
      "For feeling lost, major decisions, burnout, and building meaningful habits",
    time: "10 minutes",
    modality: "ACT",
    origin:
      "Developed by Steven Hayes as a core component of Acceptance and Commitment Therapy (ACT), which emphasizes values-driven living over symptom reduction.",
    whatThisIs:
      "Values clarification is the process of figuring out what actually matters to you — not what your parents told you should matter, not what social media says success looks like, but what genuinely lights you up and gives your life meaning. In ACT (Acceptance and Commitment Therapy), values are your compass. They don't change based on your mood or circumstances, and they're never fully \"achieved\" — they're ongoing directions you move toward.\n\nValues are different from goals. A goal is something you complete (\"get promoted\"). A value is a direction you travel (\"bring excellence and integrity to my work\"). Goals end. Values guide. This distinction matters because goal-fixation leads to the \"arrival fallacy\" — the crushing realization that achieving the goal didn't make you happy. Values-based living, on the other hand, creates meaning in the journey itself.\n\nThis exercise walks you through identifying your core values across 8 life domains, assessing how aligned your current life is with those values, and committing to one concrete action that brings you closer to your values this week. It's especially powerful during transitions, burnout, or whenever you feel disconnected from meaning.",
    neuroscience:
      "Values-based decision-making activates the ventromedial prefrontal cortex, the brain region responsible for personal meaning and intrinsic motivation. When actions align with values, the brain releases dopamine differently than from external rewards — creating sustainable, intrinsic motivation rather than the crash-and-burn cycle of external validation. Research shows values-aligned behavior also activates the nucleus accumbens in a more sustained pattern, building lasting motivation rather than the spike-and-crash of reward-seeking.",
    whenToUse: [
      "When you feel lost or directionless",
      "When making a major life decision",
      "When burnout makes everything feel meaningless",
      "When you're people-pleasing at the expense of yourself",
      "When you want to build habits that actually stick",
    ],
    relatedSlugs: ["behavioral-activation", "radical-acceptance"],
    faqs: [
      {
        q: "What's the difference between values and goals?",
        a: "Goals are things you achieve and complete (\"run a marathon\"). Values are ongoing directions (\"prioritize my health and vitality\"). Goals end; values guide. You can set goals that serve your values, but values themselves are never \"done.\"",
      },
      {
        q: "What if my values conflict with each other?",
        a: "This is normal and human. Career ambition might conflict with family time. The goal isn't to eliminate conflict but to make conscious choices about which value takes priority in a given moment, rather than defaulting to habit or pressure.",
      },
      {
        q: "How do I know if these are my real values or just what I think I should value?",
        a: "Ask yourself: \"If nobody would ever know, would I still choose this?\" Real values energize you. \"Should\" values drain you. If a value feels like obligation rather than meaning, it might be someone else's value that you've internalized.",
      },
      {
        q: "Can my values change over time?",
        a: "Core values tend to be fairly stable, but their priority can shift with life stages. Someone in their 20s might prioritize adventure and career; in their 40s, family and health might move up. Regular check-ins help you notice these natural shifts.",
      },
    ],
    steps: [
      {
        title: "Rate These Life Areas",
        instruction:
          "For each of these 8 value categories, rate how important it is to you from 1 (not important) to 10 (deeply important). Go with your gut — don't overthink it.",
        type: "multi-input",
        fields: [
          "Relationships (1-10):",
          "Career / Purpose (1-10):",
          "Health / Wellbeing (1-10):",
          "Personal Growth (1-10):",
          "Community / Contribution (1-10):",
          "Creativity / Play (1-10):",
          "Spirituality / Meaning (1-10):",
          "Independence / Freedom (1-10):",
        ],
      },
      {
        title: "Identify Your Top Values",
        instruction:
          "Looking at your ratings, which 3 areas scored highest? These are your core value domains. Write them below, and for each one, write what it specifically means to YOU (not a dictionary definition).",
        type: "multi-input",
        fields: [
          "Core value 1 and what it means to me:",
          "Core value 2 and what it means to me:",
          "Core value 3 and what it means to me:",
        ],
      },
      {
        title: "Assess Alignment",
        instruction:
          "For each of your top 3 values, rate how well your current daily life aligns with that value. 1 = completely out of alignment, 10 = living it fully.",
        type: "multi-input",
        fields: [
          "Value 1 alignment (1-10):",
          "Value 2 alignment (1-10):",
          "Value 3 alignment (1-10):",
        ],
      },
      {
        title: "Find the Gap",
        instruction:
          "Look at where the biggest gap is between importance and alignment. This is where you're most likely feeling the pain of disconnection. Which value has the biggest gap?",
        type: "text-input",
        placeholder: "The biggest gap is in...",
      },
      {
        title: "One Values-Aligned Action",
        instruction:
          "What is ONE specific, concrete action you can take THIS WEEK that moves you closer to your most misaligned value? Make it small enough that you'll actually do it.",
        type: "text-input",
        placeholder: "This week I will...",
      },
      {
        title: "Commit",
        instruction:
          "You've just identified what matters most to you and where your life is out of alignment. That awareness alone is powerful. The one action you chose — put it in your calendar right now. Values don't mean anything until they become actions.",
        type: "reflection",
      },
    ],
  },

  // ─── 16. OVERWHELMED AT WORK ───────────────────────────────────────────────
  {
    slug: "overwhelmed-at-work",
    title: "When Work Is Too Much: A 3-Minute Reset for Overwhelm",
    metaTitle: "Overwhelmed at Work? A Clinician-Designed 3-Minute Reset",
    metaDescription:
      "Drowning in tasks and deadlines? This evidence-framed protocol helps you regain focus and calm when work feels impossible. Clinician-informed by Kevin, a psychiatric nurse practitioner candidate.",
    keywords: "overwhelmed at work, work stress, how to deal with overwhelm, workplace anxiety",
    subtitle: "For task paralysis, racing thoughts, and the feeling that you'll never catch up",
    time: "5 minutes",
    modality: "CBT/Somatic",
    origin:
      "Combines cognitive load management research with nervous system regulation techniques from somatic therapy.",
    whatThisIs:
      "You know that feeling when your to-do list is so long that you can't even start? When every notification feels like a demand and your brain is spinning through everything you should be doing while your body stays frozen? That's overwhelm — and it's not a personal failing. It's your nervous system in a threat response.\n\nOverwhelm happens when the cognitive demands on you exceed your perceived capacity to handle them. Your brain interprets this as danger and triggers a freeze response. You scroll, you avoid, you stare at the same email for 20 minutes. The irony is that the more overwhelmed you feel, the less able you are to do the things that would help.\n\nThis technique breaks that cycle by addressing both the cognitive overload (by radically narrowing your focus) and the nervous system activation (by signaling safety). It takes less than 5 minutes, and you can do it at your desk, in a bathroom stall, or even during a meeting with your camera off.",
    neuroscience:
      "Overwhelm can narrow attention, increase body arousal, and make planning feel harder. The protocol works by first lowering some of that activation through breath, then simplifying the task field enough that you can choose one concrete next step instead of wrestling with an abstract mountain of demands.",
    whenToUse: [
      "When you have 47 browser tabs open and can't focus on any",
      "When you've been staring at the same task for 20+ minutes without progress",
      "When your heart races looking at your inbox",
      "When you're procrastinating because everything feels equally urgent",
      "Before diving into a complex project",
    ],
    relatedSlugs: ["box-breathing", "behavioral-activation"],
    faqs: [
      {
        q: "Why do I freeze when I'm overwhelmed instead of getting things done?",
        a: "Freezing is your nervous system's protective response to perceived threat. When your brain detects more demands than it thinks you can handle, it defaults to immobilization as a survival strategy. It's not laziness — it's biology.",
      },
      {
        q: "What if I can't even identify one next action?",
        a: "That's a sign your executive function is deeply impaired. Pick something absurdly small: open one document, send one email, or even just write down the first task. Action restarts cognition.",
      },
      {
        q: "How often should I use this technique?",
        a: "Use it whenever you notice the overwhelm spiral starting. Some people use it multiple times daily during stressful periods. Preventative use (before you hit 10/10 overwhelm) is most effective.",
      },
    ],
    steps: [
      {
        title: "Stop and Breathe",
        instruction:
          "Pause everything. Close your eyes or soften your gaze. Take three slow breaths — in for 4, out for 6. Longer exhales signal safety to your nervous system.",
        type: "breathing",
        breathe: { inhale: 4, hold: 2, exhale: 6 },
        duration: 36,
      },
      {
        title: "Name the Overwhelm",
        instruction:
          "Say to yourself (silently or out loud): 'I am overwhelmed. This is a normal response to having too many cognitive demands. It's not a personal failure.'",
        type: "reflection",
      },
      {
        title: "Brain Dump",
        instruction:
          "Write down everything on your mental plate right now — every task, worry, obligation. Don't organize, don't prioritize. Just dump it all onto paper (or screen). Empty your working memory.",
        type: "text-input",
        placeholder: "Everything on my mind right now...",
      },
      {
        title: "Choose ONE Thing",
        instruction:
          "From your list, pick the ONE thing that feels most doable right now — not most important, most doable. Circle it. That's your only job for the next 20 minutes.",
        type: "text-input",
        placeholder: "My single next action is...",
      },
      {
        title: "Set a Timer",
        instruction:
          "Set a timer for 20 minutes. Work only on your chosen task. When the timer ends, reassess. You can do anything for 20 minutes.",
        type: "timer",
        duration: 20,
      },
      {
        title: "Check In",
        instruction:
          "How do you feel now compared to when you started?",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 17. GRIEF WAVE ────────────────────────────────────────────────────
  {
    slug: "grief-wave",
    title: "Riding a Wave of Grief: A Compassionate Guide Through the Pain",
    metaTitle: "Grief Waves: How to Cope When Grief Hits Hard",
    metaDescription:
      "When grief crashes over you unexpectedly, this gentle protocol helps you stay present with the pain without drowning in it. Evidence-based, trauma-informed support.",
    keywords: "grief waves, coping with grief, grief comes in waves, how to handle grief",
    subtitle: "For the moments when grief hits you out of nowhere",
    time: "6 minutes",
    modality: "Compassion-Focused/DBT",
    origin:
      "Draws from Dual Process Model of Grief (Stroebe & Schut) and Compassion-Focused Therapy techniques.",
    whatThisIs:
      "Grief doesn't follow a straight line. It comes in waves — sometimes predictable, sometimes not. You might be having a fine day and then a song, a smell, or a random memory hits you, and suddenly you're doubled over. That's not you failing to cope. That's grief processing.\n\nThe wave metaphor matters. Waves build, crest, and break. They don't stay at peak intensity forever. But when we fight the wave — when we try to suppress it, distract from it, or judge ourselves for feeling it — we exhaust ourselves and prolong the suffering. Riding the wave means allowing it to move through you while staying anchored enough that you don't drown.\n\nThis technique is for those moments when grief ambushes you. It won't make the grief go away (nothing can do that, and trying to is its own problem). But it will help you move through the wave with more steadiness, self-compassion, and trust that it will pass.",
    neuroscience:
      "Grief activates the same brain regions as physical pain (anterior cingulate cortex). The wave-like nature of grief reflects how the brain processes loss — moving between 'loss-oriented' and 'restoration-oriented' states. Fighting grief triggers additional suffering through secondary stress, while allowing and naming emotions reduces limbic activation. The practice of self-compassion during grief activates the caregiving system (releasing oxytocin), which provides genuine physiological soothing.",
    whenToUse: [
      "When grief hits you unexpectedly",
      "On anniversaries, birthdays, or other trigger days",
      "When a wave hits at work or in public",
      "When you've been avoiding grief and it's breaking through",
      "When you need to feel it but stay functional",
    ],
    relatedSlugs: ["self-compassion-break", "radical-acceptance"],
    faqs: [
      {
        q: "How long do grief waves last?",
        a: "Individual waves typically last 20-90 minutes at peak intensity. The overall experience of grief changes over months and years, but waves become less frequent and less devastating over time. Riding them, rather than fighting them, helps them pass more quickly.",
      },
      {
        q: "Is it normal for grief to hit me months or years later?",
        a: "Absolutely. Grief has no timeline. Anniversary reactions, new triggers, and delayed processing are all normal. Having a wave years later doesn't mean you're 'not over it' — it means you're still processing a significant loss.",
      },
      {
        q: "What if I can't afford to feel this right now?",
        a: "If you're in a situation where you can't safely process the wave, it's okay to set it aside temporarily. Say to yourself: 'I will feel this fully when I'm safe and private.' Then choose a specific time later to return to it.",
      },
    ],
    steps: [
      {
        title: "Recognize the Wave",
        instruction:
          "Notice what's happening. 'A grief wave is here.' Naming it creates a tiny bit of space between you and the pain.",
        type: "reflection",
      },
      {
        title: "Find Your Anchor",
        instruction:
          "Place your feet on the floor. Feel the ground beneath you. Put one hand on your heart, one on your belly. You are here, in this body, in this moment. The wave is moving through you, but you are not the wave.",
        type: "reflection",
      },
      {
        title: "Breathe With the Pain",
        instruction:
          "Don't try to breathe around the grief. Breathe through it. Imagine breathing into the place in your body where the grief is strongest. Let your breath create space around the pain.",
        type: "breathing",
        breathe: { inhale: 5, hold: 2, exhale: 7 },
        duration: 28,
      },
      {
        title: "Allow the Feelings",
        instruction:
          "What emotion is present? Name it: sadness, anger, longing, guilt, loneliness, or something else. Let yourself feel it without judging it or trying to fix it. This is grief doing its work.",
        type: "text-input",
        placeholder: "Right now, I'm feeling...",
      },
      {
        title: "Offer Yourself Kindness",
        instruction:
          "What would you say to a friend who just told you they were feeling this exact grief? Say those words to yourself now. Put your hand on your heart and offer yourself that same kindness.",
        type: "text-input",
        placeholder: "What I would say to a friend in this pain...",
      },
      {
        title: "Trust the Wave",
        instruction:
          "The wave will crest and it will break. It always does. You don't have to know when. You just have to stay present with yourself until it does. Take one more breath.",
        type: "reflection",
      },
    ],
  },

  // ─── 18. SUNDAY SCARIES ────────────────────────────────────────────────
  {
    slug: "sunday-scaries",
    title: "The Sunday Night Dread: How to End the Weekend Anxiety Spiral",
    metaTitle: "Sunday Scaries? How to Stop Weekend Anxiety Tonight",
    metaDescription:
      "Dreading Monday before it even arrives? This evidence-based protocol helps you break the Sunday anxiety cycle and reclaim your Sunday nights.",
    keywords: "Sunday scaries, Sunday anxiety, Sunday night dread, weekend anxiety",
    subtitle: "For the anticipatory anxiety that steals your Sunday evening",
    time: "7 minutes",
    modality: "CBT/Mindfulness",
    origin:
      "Based on anticipatory anxiety treatment protocols and research on work-related rumination.",
    whatThisIs:
      "It's Sunday evening. You should be relaxing, but instead your mind is already racing through tomorrow's to-do list, dreading the alarm, replaying last week's stresses. The weekend never feels long enough, and Monday is coming faster than you can handle. You're not alone — this is so common it has a name: the Sunday Scaries.\n\nSunday anxiety is a form of anticipatory anxiety — your nervous system ramps up in preparation for a perceived threat (work/school). The irony is that the more you dread Monday, the more you spoil Sunday, and the more exhausted you are when Monday actually arrives. It's a self-fulfilling prophecy.\n\nThis technique interrupts that cycle. You'll address both the cognitive patterns (catastrophizing, mind-reading about tomorrow) and the physiological arousal (racing heart, tension) that make Sunday evenings miserable. By the end, Monday won't be your favorite day, but Sunday night can be yours again.",
    neuroscience:
      "Anticipatory anxiety can make the body gear up before any actual threat is present. Rumination keeps that loop going by repeatedly pulling attention into tomorrow. The protocol works by grounding you in the present, challenging catastrophic predictions, and drawing a healthier boundary between rest and preparation.",
    whenToUse: [
      "Sunday afternoon when dread starts building",
      "When you can't enjoy your weekend thinking about work",
      "When Sunday night insomnia hits",
      "When you catch yourself mentally reviewing tomorrow's tasks",
      "For anyone who gets \"the ick\" on Sunday evenings",
    ],
    relatedSlugs: ["worry-time", "cognitive-restructuring"],
    faqs: [
      {
        q: "Why do I get anxious on Sundays specifically?",
        a: "It's anticipatory anxiety combined with the transition from unstructured to structured time. Your body starts the stress response early, and rumination reinforces it. For many, it's also about unprocessed work stress or a job that doesn't feel safe.",
      },
      {
        q: "Should I prepare for Monday on Sunday to feel more in control?",
        a: "Strategic preparation (laying out clothes, reviewing calendar briefly) can help if done early and briefly. But avoid using Sunday as a 'second workday' to try to get ahead — this steals your recovery time.",
      },
      {
        q: "What if my Sunday scaries are about a job I hate?",
        a: "If every Sunday is filled with dread, that's important information about your work situation. These techniques help in the short term, but the deeper solution may be addressing the job itself — whether that's boundaries, a conversation, or a change.",
      },
    ],
    steps: [
      {
        title: "Ground in This Moment",
        instruction:
          "Right now, it's still Sunday. Monday is not here. Feel the surface beneath you, hear the sounds around you. Bring your attention to what's actually happening right now, not what will happen.",
        type: "reflection",
      },
      {
        title: "Name the Dread",
        instruction:
          "What specifically are you dreading? Not just 'Monday' — what exactly? Is it a specific meeting? A person? The commute? The feeling of being unprepared? Name it specifically.",
        type: "text-input",
        placeholder: "What I'm dreading specifically is...",
      },
      {
        title: "Challenge the Catastrophe",
        instruction:
          "Now ask yourself: What's the worst that could realistically happen tomorrow? And what's most likely to happen? Let your brain see the difference between fear and reality.",
        type: "multi-input",
        fields: [
          "Worst case scenario:",
          "Most likely scenario:",
        ],
      },
      {
        title: "Draw the Line",
        instruction:
          "Say to yourself: 'Sunday is for rest. Work belongs to Monday. I am choosing to be here, now, and let Monday wait its turn.' Visualize a line between today and tomorrow.",
        type: "reflection",
      },
      {
        title: "Breathe Out the Dread",
        instruction:
          "Inhale slowly, and on the exhale, imagine releasing the tension and dread. Give your nervous system permission to downshift.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 8 },
        duration: 32,
      },
      {
        title: "Choose Sunday",
        instruction:
          "What's one thing you can do right now that's purely for enjoyment or rest? Not productive, not preparing — just present. Go do that thing.",
        type: "text-input",
        placeholder: "My Sunday evening choice is...",
      },
    ],
  },

  // ─── 19. RAGE SPIRAL ────────────────────────────────────────────────────
  {
    slug: "rage-spiral",
    title: "When Anger Takes Over: Stopping the Rage Spiral Before It Erupts",
    metaTitle: "Anger Spirals: How to Stop Rage Taking Over | DBT-Based",
    metaDescription:
      "Feeling like you're about to explode? This DBT-based protocol helps you stop the anger spiral and respond instead of react. Evidence-based anger management.",
    keywords: "rage spiral, anger spiral, how to control anger, anger management techniques",
    subtitle: "For when anger is hijacking your brain and you need to stop it NOW",
    time: "5 minutes",
    modality: "DBT",
    origin:
      "Based on DBT's emotion regulation and distress tolerance modules, incorporating research on the physiology of rage.",
    whatThisIs:
      "There's a point where anger stops being information and starts taking over. Your heart pounds, your muscles tense, your vision narrows. Rational thought becomes nearly impossible because your prefrontal cortex has been effectively shut down by the storm of neurochemicals flooding your brain. This is the rage spiral — and trying to think your way out of it is useless.\n\nThe rage spiral starts with a trigger (an insult, an injustice, a frustration), then builds through rumination ('How dare they...', 'They always...'), physical escalation (heart rate, tension), and catastrophic thinking. By the time you're in full spiral, your body is in fight-or-flight mode and your words and actions will be driven by a brain that's evolutionarily designed for survival, not for making good decisions.\n\nThis technique is designed for the acute phase — when you're at a 7-10 on the anger scale and need to do something RIGHT NOW. It addresses the physiology first (because you can't think straight when rage chemicals are surging) and then the cognitive patterns that fuel the fire. The goal isn't to never feel anger — anger is useful information. The goal is to prevent anger from destroying your relationships, your reputation, and your peace of mind.",
    neuroscience:
      "Rage brings fast sympathetic activation, narrowed attention, and weaker impulse control. That is why people often do things in anger they would never choose from a calmer state. The brief-pause logic here is practical, not mystical: even a short interruption can reduce the first surge enough to help you regain a little choice.",
    whenToUse: [
      "When you feel like you're about to yell, hit, or break something",
      "When you're in an argument and can't think clearly",
      "When anger has been building and you're about to snap",
      "After being cut off in traffic, insulted, or treated unfairly",
      "When you feel 'seeing red'",
    ],
    relatedSlugs: ["tipp-skill", "box-breathing"],
    faqs: [
      {
        q: "What if I can't control my anger even when I try?",
        a: "If rage spirals are frequent and intense despite using techniques, there may be underlying factors — trauma, chronic stress, certain medical conditions, or patterns that need professional support. This doesn't mean you're broken. It means you deserve more support.",
      },
      {
        q: "Isn't expressing anger better than suppressing it?",
        a: "Neither extreme works. Suppressing anger leads to resentment and physical health problems. Exploding in rage damages relationships and reinforces neural pathways for more rage. The middle path is feeling the anger, understanding its message, and responding intentionally rather than reacting.",
      },
      {
        q: "How can I remember to use this when I'm in a rage?",
        a: "Practice the technique when you're calm so the steps become automatic. Having a physical cue (like running cold water over your hands) can trigger the memory of the practice. Over time, the gap between trigger and response grows.",
      },
    ],
    steps: [
      {
        title: "STOP",
        instruction:
          "Literally stop moving. Freeze. Don't speak, don't act, don't send that text. Put physical distance between you and the trigger if possible. Step away. Now.",
        type: "reflection",
      },
      {
        title: "Cold Water",
        instruction:
          "Splash cold water on your face or hold something cold against your cheeks. For many people, cold facial temperature helps the body downshift quickly and interrupts the escalation cycle.",
        type: "timer",
        duration: 30,
      },
      {
        title: "The 6-Second Rule",
        instruction:
          "Give yourself a short pause before you act. Count slowly: 1... 2... 3... 4... 5... 6... You're not trying to become serene in six seconds — you're interrupting the first surge. Count again.",
        type: "timer",
        duration: 12,
      },
      {
        title: "Rate Your Anger",
        instruction:
          "On a scale of 1-10, how angry are you right now? Just notice. Naming it begins to engage your prefrontal cortex.",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Breathe It Down",
        instruction:
          "Long slow exhales. In for 4, out for 8. Each long exhale signals 'safe' to your brain. Keep going until your rating drops by at least 2 points.",
        type: "breathing",
        breathe: { inhale: 4, hold: 2, exhale: 8 },
        duration: 42,
      },
      {
        title: "Choose Your Response",
        instruction:
          "Now — with your prefrontal cortex back online — what response aligns with your values? Not what your anger wants to do, but what YOU want to do. This might mean setting a boundary, speaking up later, or simply choosing not to give this more of your energy.",
        type: "text-input",
        placeholder: "My intentional response will be...",
      },
    ],
  },

  // ─── 20. IMPOSTER SYNDROME ─────────────────────────────────────────────
  {
    slug: "imposter-syndrome",
    title: "Feeling Like a Fraud: Breaking Free from Imposter Syndrome",
    metaTitle: "Imposter Syndrome: How to Stop Feeling Like a Fraud | CBT-Based",
    metaDescription:
      "Convinced you're a fraud about to be exposed? This evidence-based protocol helps you recognize and challenge imposter syndrome thoughts so you can own your achievements.",
    keywords: "imposter syndrome, feeling like a fraud, imposter syndrome help, imposter syndrome CBT",
    subtitle: "For when you believe you've fooled everyone and you're about to be found out",
    time: "6 minutes",
    modality: "CBT",
    origin:
      "Based on CBT protocols for cognitive distortions, with specific application to imposter phenomenon research.",
    whatThisIs:
      "You got the promotion, the acceptance letter, the positive feedback — and all you can think is 'They made a mistake' or 'I got lucky' or 'If they knew the real me, they'd take it back.' Imposter syndrome is the persistent inability to internalize accomplishments, combined with a deep fear of being exposed as a fraud.\n\nIt's incredibly common, especially among high achievers. Studies suggest 70% of people experience imposter syndrome at some point. It's especially prevalent in marginalized groups, first-generation professionals, and perfectionists. You're not broken for feeling this way — but you also don't have to keep living under its shadow.\n\nThis technique targets the cognitive distortions that fuel imposter syndrome: attributing success to luck, dismissing evidence of competence, mind-reading others' opinions, and holding yourself to impossible standards. By the end, you won't suddenly believe you're amazing (that's not the goal), but you'll have a clearer, fairer view of what you've actually earned.",
    neuroscience:
      "Imposter syndrome involves a persistent mismatch between internal self-assessment and external evidence. The brain's negativity bias causes you to weight failures and criticism more heavily than successes and praise. Additionally, the Dunning-Kruger effect creates a paradox where competence makes you more aware of what you don't know, while true expertise brings self-doubt. The practice of actively collecting evidence of competence retrains the brain's weighting mechanism and strengthens neural pathways for accurate self-assessment.",
    whenToUse: [
      "After receiving praise that you want to dismiss",
      "Before presentations or performance reviews",
      "When comparing yourself to others",
      "When 'you don't belong here' thoughts are loud",
      "After a success that doesn't feel earned",
    ],
    relatedSlugs: ["cognitive-distortions", "self-compassion-break"],
    faqs: [
      {
        q: "Is imposter syndrome a mental illness?",
        a: "No — imposter syndrome isn't a diagnosis. It's a phenomenon, a pattern of thinking that's extremely common, especially in certain contexts. However, persistent imposter thoughts can contribute to or be exacerbated by anxiety and depression.",
      },
      {
        q: "Does imposter syndrome ever go away?",
        a: "For many people, it becomes more manageable with awareness and practice. The thoughts might still appear, but they lose their power. Some people report that imposter feelings decrease as they accumulate evidence of competence and connect with others who share similar doubts.",
      },
      {
        q: "What if I actually AM underqualified?",
        a: "It's good to have an accurate assessment of your skills — that's healthy. Imposter syndrome is when you have evidence of competence but can't internalize it. If you genuinely have gaps, you can acknowledge those AND acknowledge what you legitimately know.",
      },
    ],
    steps: [
      {
        title: "Name the Imposter Thought",
        instruction:
          "What's the specific thought telling you you're a fraud? Write it exactly as your mind says it.",
        type: "text-input",
        placeholder: "The thought in my head is...",
      },
      {
        title: "Identify the Distortion",
        instruction:
          "Which cognitive distortion is at work? Common imposter distortions include: discounting positives ('That doesn't count'), attributing success to luck ('I got lucky'), mind-reading ('They'd think less of me if they knew'), and all-or-nothing thinking ('If I'm not perfect, I'm a fraud').",
        type: "choice",
        options: [
          "Discounting the positive",
          "Attributing success to luck/chance",
          "Mind-reading what others think",
          "All-or-nothing thinking",
          "Comparing myself to others",
        ],
      },
      {
        title: "The Evidence Review",
        instruction:
          "List 3 pieces of evidence that contradict the imposter thought. These can be achievements you earned, positive feedback you received, challenges you overcame, or skills you genuinely possess. Don't minimize — state facts.",
        type: "multi-input",
        fields: [
          "Evidence 1:",
          "Evidence 2:",
          "Evidence 3:",
        ],
      },
      {
        title: "The Fair Assessment",
        instruction:
          "Now write a balanced, accurate statement that includes BOTH what you genuinely need to learn AND what you legitimately know. Not false modesty, not narcissism — accuracy.",
        type: "text-input",
        placeholder: "An accurate statement about my abilities...",
      },
      {
        title: "What Would You Say to a Friend?",
        instruction:
          "If a friend told you they had this exact imposter thought, what would you say to them? Write that message now.",
        type: "text-input",
        placeholder: "If my friend felt this way, I would tell them...",
      },
      {
        title: "Own One Thing",
        instruction:
          "Name one accomplishment — big or small — that you're willing to fully own. Not 'it was nothing' or 'anyone could do it.' Just: 'I did this. I earned this.'",
        type: "text-input",
        placeholder: "One thing I earned and own...",
      },
    ],
  },

  // ─── 21. DECISION PARALYSIS ─────────────────────────────────────────────
  {
    slug: "decision-paralysis",
    title: "When You Can't Choose: Breaking Through Decision Paralysis",
    metaTitle: "Decision Paralysis: How to Make a Choice When You're Stuck",
    metaDescription:
      "Stuck between options and can't decide? This evidence-based protocol helps you move from paralysis to decision. Based on decision science and CBT.",
    keywords: "decision paralysis, analysis paralysis, how to make hard decisions, decision anxiety",
    subtitle: "For when every option feels wrong and you can't move forward",
    time: "7 minutes",
    modality: "CBT/Behavioral",
    origin:
      "Integrates decision science research, CBT for anxiety, and ACT principles for values-aligned decision-making.",
    whatThisIs:
      "You've been staring at the options for too long. Every choice has pros and cons, and no path seems clearly right. The more you think, the more stuck you feel. This is decision paralysis — and it's often not actually about the decision.\n\nDecision paralysis typically stems from three sources: perfectionism (wanting the 'right' answer), fear of regret (worrying about making the wrong choice), and loss aversion (focusing on what you'll give up rather than what you'll gain). Your brain, trying to protect you, runs endless simulations of possible outcomes until you're frozen.\n\nThe ironic truth is that most decisions are reversible or less consequential than they feel. Even 'big' decisions rarely have a single point of no return. This technique helps you identify what's actually blocking you, reduce the decision to its essential components, and move forward — even when uncertainty remains. The goal isn't to guarantee the 'right' choice; the goal is to choose.",
    neuroscience:
      "Decision-making involves the prefrontal cortex weighing options against values and goals. Overthinking floods this system, creating 'analysis paralysis' — the more data processed, the worse the decision quality. This is called the decision-fatigue effect. Additionally, the fear of regret activates the same brain regions as physical pain, making the prospect of a wrong choice feel genuinely painful. The technique works by limiting options, setting decision deadlines, and reconnecting with values (which engages the ventromedial prefrontal cortex for values-based rather than fear-based decisions).",
    whenToUse: [
      "When you've been stuck on a decision for days or weeks",
      "When you're researching endlessly without progress",
      "When you fear making the wrong choice so much you won't choose",
      "For both big decisions (jobs, relationships) and small (what to eat)",
      "When others are waiting on your decision",
    ],
    relatedSlugs: ["values-clarification", "cognitive-restructuring"],
    faqs: [
      {
        q: "What if I make the wrong decision?",
        a: "Here's the truth: you probably will make some decisions that don't work out. Everyone does. That's not failure — that's learning what you don't want, which is valuable information. Most decisions can be adjusted or reversed.",
      },
      {
        q: "How do I know when I've researched enough?",
        a: "Research shows that after gathering about 70% of available information, additional information rarely improves decision quality but significantly increases decision time. If you find yourself re-researching the same points, you've hit diminishing returns.",
      },
      {
        q: "What if all options genuinely seem equally good or bad?",
        a: "When options are truly equally weighted, the decision matters less — flip a coin. The anxiety isn't about the difference between options; it's about your relationship with choosing itself.",
      },
    ],
    steps: [
      {
        title: "Name the Decision",
        instruction:
          "What decision are you facing? Write it clearly as a question.",
        type: "text-input",
        placeholder: "The decision I'm facing is...",
      },
      {
        title: "List Your Options",
        instruction:
          "What are your actual options? Not every possible variation — the main choices. Limit to 3-5 maximum.",
        type: "multi-input",
        fields: [
          "Option A:",
          "Option B:",
          "Option C (if any):",
        ],
      },
      {
        title: "What's Blocking You?",
        instruction:
          "Which fear is most keeping you stuck? Naming it reduces its power.",
        type: "choice",
        options: [
          "Fear of making the wrong choice (regret)",
          "Fear of missing out on the other option (FOMO)",
          "Fear of others' judgment",
          "Perfectionism — wanting the 'perfect' answer",
          "Not having enough information",
        ],
      },
      {
        title: "The 10-10-10 Test",
        instruction:
          "If you make this decision, how will you feel about it in 10 minutes? In 10 months? In 10 years? Often our immediate fear is much bigger than the long-term reality.",
        type: "multi-input",
        fields: [
          "In 10 minutes...",
          "In 10 months...",
          "In 10 years...",
        ],
      },
      {
        title: "What Does Your Gut Say?",
        instruction:
          "If you didn't have to justify it to anyone, which option would you choose? Sometimes your intuition has already processed information your conscious mind hasn't.",
        type: "choice",
        options: [
          "Option A",
          "Option B",
          "Option C",
          "I genuinely don't know yet",
        ],
      },
      {
        title: "Set a Decision Deadline",
        instruction:
          "Decisions become harder, not easier, with more time. Set a deadline. Write it down. When the deadline arrives, you will choose.",
        type: "text-input",
        placeholder: "My decision deadline is...",
      },
    ],
  },

  // ─── 22. SOCIAL EXHAUSTION ──────────────────────────────────────────────
  {
    slug: "social-exhaustion",
    title: "Drained After Being Around People: Recovering from Social Exhaustion",
    metaTitle: "Social Exhaustion: How to Recover When People Drain You",
    metaDescription:
      "Feeling drained and depleted after social interactions? This protocol helps you understand and recover from social exhaustion — whether you're introverted, highly sensitive, or just burned out.",
    keywords: "social exhaustion, social battery drained, introvert burnout, social hangover",
    subtitle: "For the crash that follows being around people",
    time: "5 minutes",
    modality: "Energy Management/Somatic",
    origin:
      "Integrates research on introversion and high sensitivity with energy management and nervous system regulation.",
    whatThisIs:
      "You got through the event, the meeting, the family gathering — barely. And now you're on the couch, drained, with nothing left. Even your phone feels like too much effort. This is social exhaustion, and it's real.\n\nSome people recharge around others; others recharge alone. Introverts and highly sensitive people have nervous systems that process social stimulation more intensely, which means it takes more energy to be around people — even people you like. Add mismatched communication styles, the effort of masking ('acting normal'), or high-stakes social situations, and the drain compounds.\n\nSocial exhaustion isn't a flaw. It's information about how your nervous system works. This protocol helps you recover from the exhaustion AND understand your social energy patterns so you can build a life that honors them instead of fighting them.",
    neuroscience:
      "The most defensible takeaway is simple: some people feel more overstimulated by social demand than others, and recovery usually works best when it reduces input rather than adding more. Quiet, fewer demands, slower breathing, and permission to stop performing can help your system settle. We avoid making rigid claims about one exact introvert or dopamine mechanism because that science is still less settled than social media often makes it sound.",
    whenToUse: [
      "After social events that drained you",
      "When you need to recharge before the next thing",
      "When 'people time' has completely depleted you",
      "On days filled with meetings or interactions",
      "When you're craving solitude and it's not available yet",
    ],
    relatedSlugs: ["body-scan", "progressive-muscle-relaxation"],
    faqs: [
      {
        q: "Is social exhaustion the same as social anxiety?",
        a: "No. Social anxiety is fear of judgment or embarrassment in social situations. Social exhaustion is depletion from social interaction, regardless of anxiety. You can be socially exhausted without being socially anxious, and vice versa.",
      },
      {
        q: "Does social exhaustion mean I don't like people?",
        a: "Not at all. Many socially exhausted people have meaningful relationships and enjoy connecting. The exhaustion is about energy capacity, not preference. You can love someone and still need to recover after being with them.",
      },
      {
        q: "How long does it take to recover from social exhaustion?",
        a: "It varies widely. For some, 30 minutes of alone time is enough. For others, especially after intense or extended social demand, full recovery can take 24-48 hours. Learning your own recovery needs is key.",
      },
    ],
    steps: [
      {
        title: "Acknowledge the Exhaustion",
        instruction:
          "Say to yourself: 'I am socially exhausted. This is valid. My nervous system needs to recover.'",
        type: "reflection",
      },
      {
        title: "Rate Your Battery",
        instruction:
          "On a scale of 1-10, how much social energy do you have left?",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        title: "Remove the Stimulation",
        instruction:
          "If possible, go somewhere quiet and alone. Put your phone on silent or away. Let your nervous system have a break from processing any social input.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Release the Mask",
        instruction:
          "Let your face relax. Let your body take any posture it wants. You don't have to be 'on' right now. No one is watching. Let the face you show the world relax.",
        type: "reflection",
      },
      {
        title: "Breathe Into Recovery",
        instruction:
          "Long slow exhales activate your recovery system. In for 4, out for 6. Let your nervous system switch from alert to rest.",
        type: "breathing",
        breathe: { inhale: 4, hold: 2, exhale: 6 },
        duration: 36,
      },
      {
        title: "Plan Your Restoration",
        instruction:
          "What do you genuinely need now to recover? It might be: alone time, a nap, comfort food, a walk, watching something familiar. Don't 'should' yourself — what do you actually need?",
        type: "text-input",
        placeholder: "What I need for recovery is...",
      },
    ],
  },

  // ─── 23. MORNING DREAD ─────────────────────────────────────────────────
  {
    slug: "morning-dread",
    title: "Waking Up With Anxiety: How to Handle Morning Dread",
    metaTitle: "Morning Anxiety: How to Handle Waking Up With Dread",
    metaDescription:
      "Waking up with a pit in your stomach? This protocol helps you handle morning anxiety and start your day without being hijacked by dread. Evidence-based.",
    keywords: "morning dread, morning anxiety, waking up anxious, cortisol awakening response",
    subtitle: "For that pit-in-your-stomach feeling when you first wake up",
    time: "6 minutes",
    modality: "CBT/Somatic",
    origin:
      "Addresses cortisol awakening response research combined with CBT anxiety management techniques.",
    whatThisIs:
      "You wake up and before you've even opened your eyes fully, there it is — the dread. A knot in your stomach, racing thoughts, a vague sense that something is wrong. Morning anxiety is real, and it's miserable.\n\nThere's a biological reason: cortisol, your body's main stress hormone, naturally peaks about 30-45 minutes after waking. It's called the Cortisol Awakening Response, and it's meant to help you mobilize for the day. But when your baseline anxiety is elevated, this natural cortisol spike can feel like emergency alarm bells.\n\nThe good news: morning anxiety doesn't predict how the rest of your day will go. In fact, it often decreases significantly once you're up and moving. This protocol helps you get through those first vulnerable moments of the day without spiraling, and retrain your nervous system to start from a calmer baseline.",
    neuroscience:
      "The Cortisol Awakening Response (CAR) is a real rise in cortisol that usually happens in the first 30-45 minutes after waking, but the size and timing vary from person to person. That shift can make an already stressed system feel even more activated. Morning anxiety is also influenced by habit, sleep quality, blood sugar, and whatever thoughts your brain reaches for first. This protocol addresses that mix with breathing, movement, fuel, and thought support.",
    whenToUse: [
      "Right when you wake up feeling anxious",
      "When you dread starting your day",
      "When morning worry spirals begin immediately",
      "When you wake up with physical anxiety symptoms",
      "When the thought of facing the day feels impossible",
    ],
    relatedSlugs: ["physiological-sigh", "cognitive-restructuring"],
    faqs: [
      {
        q: "Why is anxiety worse in the morning?",
        a: "Usually it is a mix of factors: your cortisol rhythm shifts after waking, your body may be under-fueled or under-rested, and your first thoughts of the day can quickly set the tone. If those thoughts are anxious, morning dread can build fast.",
      },
      {
        q: "Does morning anxiety mean something is wrong with my day?",
        a: "Not necessarily. Morning anxiety often feels predictive ('something bad will happen') but it's usually residual — your nervous system processing yesterday's stress or waking up in a heightened state. Most people find it decreases significantly within an hour.",
      },
      {
        q: "Should I stay in bed until the anxiety passes?",
        a: "Generally, gentle movement helps more than staying still. Lying in bed with anxious thoughts tends to fuel the spiral. Getting up, moving, and especially eating something signals safety to your system.",
      },
    ],
    steps: [
      {
        title: "Don't Reach for Your Phone",
        instruction:
          "Before you check notifications, emails, or social media — pause. Your brain is vulnerable right now. Don't add more input.",
        type: "reflection",
      },
      {
        title: "Physiological Sigh",
        instruction:
          "In bed, do 3 physiological sighs: double inhale through your nose, long exhale through your mouth. This directly activates your calming nervous system.",
        type: "breathing",
        breathe: { inhale: 3, hold: 1, exhale: 6 },
        duration: 30,
      },
      {
        title: "Name What You're Feeling",
        instruction:
          "Say it: 'I'm waking up with anxiety. This is uncomfortable, but it's just a feeling. It doesn't mean something is wrong with today.'",
        type: "reflection",
      },
      {
        title: "Get Something in Your Body",
        instruction:
          "Low blood sugar amplifies morning anxiety. Drink water and eat something — even something small. This signals safety to your nervous system.",
        type: "reflection",
      },
      {
        title: "Move Your Body",
        instruction:
          "Gentle movement shifts your nervous system. Stretch, walk to another room, do 10 jumping jacks — something to get your body moving energy through.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Set Today's Intention",
        instruction:
          "What's one thing you want to carry into today? Not a to-do list — a state of mind. A feeling. Write one word or phrase.",
        type: "text-input",
        placeholder: "My intention for today is...",
      },
    ],
  },

  // ─── 24. COMPARISON TRAP ───────────────────────────────────────────────
  {
    slug: "comparison-trap",
    title: "The Social Media Comparison Spiral: Breaking Free from the Trap",
    metaTitle: "Comparison Trap: How to Stop Comparing Yourself on Social Media",
    metaDescription:
      "Comparing your life to what you see online? This evidence-based protocol helps you break the comparison cycle and relate to yourself with more compassion.",
    keywords: "comparison trap, social media comparison, comparing yourself to others, social media envy",
    subtitle: "For when your life looks small compared to everyone else's online",
    time: "5 minutes",
    modality: "CBT/Mindfulness",
    origin:
      "Based on research on upward social comparison, CBT protocols for cognitive distortions, and mindfulness-based approaches.",
    whatThisIs:
      "You're scrolling, and suddenly you feel it — that twist in your stomach. Someone's success, someone's vacation, someone's relationship, someone's body. Your brain instantly compares: their best to your average, their public face to your private struggle. The comparison trap doesn't make you feel worse about them — it makes you feel worse about you.\n\nSocial media has supercharged comparison. Previous generations compared themselves to neighbors and coworkers. Now you compare yourself to millions of curated highlights. Studies show that time on social media correlates with decreased wellbeing, and the mechanism is largely upward comparison — seeing others as better off than you.\n\nThe comparison trap is fueled by cognitive distortions: you see others' highlight reels and compare them to your unedited footage. You don't see their struggles, their insecurities, their bad days. This protocol helps you interrupt the comparison spiral, see the distortion for what it is, and shift into a mindset that serves you.",
    neuroscience:
      "Upward social comparison activates brain regions associated with negative self-evaluation and envy, while decreasing activity in reward circuits. The prefrontal cortex makes the comparison, and the emotional consequence shows up as shame, envy, or inadequacy. Repeated comparison creates stronger neural pathways for self-criticism. The technique disrupts this by activating metacognition (thinking about thinking), which engages lateral prefrontal cortex and reduces the emotional grip of the comparison.",
    whenToUse: [
      "After scrolling and feeling worse about yourself",
      "When you're comparing your chapter 3 to someone's chapter 20",
      "When someone else's success feels like your failure",
      "When you can't stop checking a specific person's profile",
      "When envy becomes resentment",
    ],
    relatedSlugs: ["cognitive-distortions", "self-compassion-break"],
    faqs: [
      {
        q: "Is comparison normal?",
        a: "Yes — it's an evolved human behavior. Comparison helped our ancestors assess their standing in groups. The problem isn't comparison itself; it's comparison to unrealistic, curated images that don't reflect reality.",
      },
      {
        q: "Should I just quit social media?",
        a: "For some people, reducing or quitting social media helps significantly. For others, changing how they engage (following accounts that make them feel good, limiting time, curating feeds) is more sustainable. Either can be valid.",
      },
      {
        q: "What if the person I'm comparing to actually IS doing better?",
        a: "First, define 'better.' You're probably comparing one dimension (their success, their travel) while ignoring others (their struggles, their sacrifices). Second, someone else's success doesn't cause your failure. Both can be true.",
      },
    ],
    steps: [
      {
        title: "Put the Phone Down",
        instruction:
          "Physically set your device aside. The comparison feed stops here.",
        type: "reflection",
      },
      {
        title: "Name the Comparison",
        instruction:
          "What specifically are you comparing? 'Their success, my failure.' 'Their body, my body.' 'Their relationship, my singleness.' Name it precisely.",
        type: "text-input",
        placeholder: "I'm comparing...",
      },
      {
        title: "See the Distortion",
        instruction:
          "What are you NOT seeing about their life? Their doubts, their struggles, their bad days, their sacrifices, what it cost them. You're comparing your blooper reel to their highlight reel.",
        type: "reflection",
      },
      {
        title: "What Do You Actually Want?",
        instruction:
          "Underneath the comparison, what do you genuinely desire? Is it the thing they have, or is it a feeling? (Security, love, success, peace, freedom?)",
        type: "text-input",
        placeholder: "What I actually want is...",
      },
      {
        title: "One Step Toward YOUR Life",
        instruction:
          "What's one small thing you can do today that moves you toward what YOU want, not what they have? Claim your own path.",
        type: "text-input",
        placeholder: "One step toward my own life...",
      },
      {
        title: "Comparison Detox",
        instruction:
          "Consider: unfollowing, muting, or limiting time with accounts that trigger comparison. You don't have to see everything. Protect your peace.",
        type: "reflection",
      },
    ],
  },

  // ─── 25. PEOPLE PLEASING ────────────────────────────────────────────────
  {
    slug: "people-pleasing",
    title: "Can't Stop Saying Yes: Breaking the People-Pleasing Pattern",
    metaTitle: "People Pleasing: How to Stop Saying Yes When You Mean No",
    metaDescription:
      "Trapped in people-pleasing? This evidence-based protocol helps you understand why you default to 'yes' and practice boundaries without guilt.",
    keywords: "people pleasing, how to stop people pleasing, setting boundaries, saying no",
    subtitle: "For when 'yes' comes out automatically and you don't know how to stop",
    time: "6 minutes",
    modality: "CBT/ACT",
    origin:
      "Combines CBT for cognitive distortions around rejection with ACT for values-aligned action and boundary setting.",
    whatThisIs:
      "They ask. You say yes — before you've even thought about it. Then you're committed, resentful, exhausted, and wondering why you can never make space for yourself. People-pleasing isn't a personality type; it's a survival strategy that outlived its usefulness.\n\nSomewhere along the way, you learned that saying no was dangerous. Maybe you grew up with a parent who couldn't handle boundaries. Maybe you learned that love was conditional on being convenient. Maybe trauma taught you that refusing meant harm. So you adapted — you became the person who always agreed, always helped, always said yes.\n\nThe problem is that chronic people-pleasing destroys your relationship with yourself. Your yes means nothing if you can't say no. Your choices aren't really choices if they're all designed to avoid others' disappointment. This protocol helps you understand your pattern, practice pausing before committing, and tolerate the discomfort of boundaries — because the discomfort of having none is worse.",
    neuroscience:
      "People-pleasing often reflects a learned threat response around disappointment, conflict, or rejection. Saying no can feel unusually intense even when the situation is objectively safe. Breaking the pattern usually means tolerating that discomfort long enough to make more values-aligned choices.",
    whenToUse: [
      "When you've agreed to something and immediately regretted it",
      "Before committing to requests when your instinct is 'yes'",
      "When resentment is building from over-giving",
      "When you need to set a boundary but feel guilty",
      "When you're exhausted from accommodating everyone",
    ],
    relatedSlugs: ["values-clarification", "self-compassion-break"],
    faqs: [
      {
        q: "Is people-pleasing the same as being nice?",
        a: "No. Kindness is a choice made freely. People-pleasing is a compulsion driven by fear of rejection or conflict. You can be genuinely kind while having boundaries — in fact, boundaries make your kindness genuine.",
      },
      {
        q: "How do I handle the guilt when I say no?",
        a: "Expect guilt — it doesn't mean you did something wrong. It means you're breaking a pattern. Sit with the guilt without acting on it. It peaks quickly and fades. Each time you tolerate it, it loses power.",
      },
      {
        q: "What if people leave when I stop pleasing them?",
        a: "Some might. Those people were relationships built on your compliance, not on who you actually are. It's painful, but it's also information: these weren't relationships that could hold your full self.",
      },
    ],
    steps: [
      {
        title: "Catch the Automatic Yes",
        instruction:
          "What request are you facing right now — or what have you already agreed to that you want to revisit?",
        type: "text-input",
        placeholder: "The request or commitment I'm thinking about...",
      },
      {
        title: "Pause",
        instruction:
          "Say: 'Let me check my schedule and get back to you.' You don't have to answer in the moment. Buying time is a complete sentence.",
        type: "reflection",
      },
      {
        title: "Check In With You",
        instruction:
          "If no one would be disappointed, what would you actually choose? Be honest — this is just between you and yourself.",
        type: "text-input",
        placeholder: "If no one would be upset, I would...",
      },
      {
        title: "The Fear Underneath",
        instruction:
          "What are you afraid will happen if you say no? Name the specific fear.",
        type: "choice",
        options: [
          "They'll be angry",
          "They'll be disappointed",
          "They'll think I'm selfish",
          "They'll leave or reject me",
          "I'll feel guilty",
        ],
      },
      {
        title: "Is This Fear True?",
        instruction:
          "Is it actually true that this person's reaction will be catastrophic? Or are you projecting past danger onto a present situation? What's most likely to happen?",
        type: "reflection",
      },
      {
        title: "Practice the Boundary",
        instruction:
          "Write out your no — direct, kind, guilt-free. 'No, I can't make that work.' 'I'm not able to help with that.' Keep it simple. You don't need to justify.",
        type: "text-input",
        placeholder: "My boundary statement...",
      },
    ],
  },

  // ─── 26. EMOTIONAL HANGOVER ─────────────────────────────────────────────
  {
    slug: "emotional-hangover",
    title: "The Day After a Breakdown: What to Do When You're Emotionally Hungover",
    metaTitle: "Emotional Hangover: How to Recover After a Breakdown",
    metaDescription:
      "Heavy, foggy, and fragile the day after an emotional breakdown? This protocol helps you recover with compassion, not self-judgment.",
    keywords: "emotional hangover, after a breakdown, emotional crash recovery, emotional hangover symptoms",
    subtitle: "For the heavy, fragile, foggy feeling after you've been through something",
    time: "5 minutes",
    modality: "Self-Compassion/Somatic",
    origin:
      "Combines self-compassion research with somatic nervous system recovery techniques.",
    whatThisIs:
      "You had a hard day. Maybe a panic attack, a crying spell, a rage episode, or just a day where everything was too much. Now it's the next day, and you feel like you've been hit by a truck — physically exhausted, emotionally raw, mentally foggy. This is an emotional hangover, and it's real.\n\nStrong emotions — anxiety, grief, rage — flood your body with stress hormones. Your muscles tense, your heart races, your nervous system mobilizes for threat. Afterward, your system needs to recover, and that recovery takes energy. It's not weakness; it's biology.\n\nThe problem is that most people respond to emotional hangovers with judgment ('Why can't I function?', 'I should be over this'), which just adds more stress. This protocol helps you treat yourself the way you'd treat a friend recovering from the flu — with patience, care, and realistic expectations.",
    neuroscience:
      "After a highly emotional day, it is common to feel physically and mentally wrung out. Part of that is simple activation-and-recovery: poor sleep, tension, crying, adrenaline, and sustained stress all take energy. The exact hormone story differs by person, so we keep the explanation practical: your system has been through a lot, and a gentler recovery stance is often more useful than pushing harder.",
    whenToUse: [
      "The morning after a panic attack or breakdown",
      "After an intensely emotional day",
      "When you feel 'raw' and fragile",
      "When your body feels heavy and tired",
      "When your brain feels foggy after yesterday's emotions",
    ],
    relatedSlugs: ["self-compassion-break", "body-scan"],
    faqs: [
      {
        q: "How long does an emotional hangover last?",
        a: "Typically 24-48 hours, sometimes longer depending on the intensity of the emotional episode and individual factors. Pushing through it usually prolongs recovery.",
      },
      {
        q: "Should I push through and function normally?",
        a: "If you can take it easy, do. Your nervous system needs recovery time. If you have responsibilities, prioritize essentials and let go of non-essentials. Treating yourself like a sick person who must perform is rarely helpful.",
      },
      {
        q: "What should I eat during an emotional hangover?",
        a: "Your body needs replenishment: hydration, protein, and foods rich in B vitamins and magnesium. Avoid alcohol and excessive caffeine, which add stress to an already depleted system.",
      },
    ],
    steps: [
      {
        title: "Name Where You Are",
        instruction:
          "Say: 'I'm in recovery. My nervous system is clearing yesterday's stress hormones. This takes time and that's okay.'",
        type: "reflection",
      },
      {
        title: "Lower Your Expectations",
        instruction:
          "Look at your to-do list. What can be postponed? What can be delegated? What can simply not happen today? Give yourself permission to run on low power mode.",
        type: "text-input",
        placeholder: "What I can let go of today...",
      },
      {
        title: "Hydrate and Nourish",
        instruction:
          "Your body is clearing chemical byproducts. Drink water. Eat something. Give your system what it needs to do its cleanup work.",
        type: "reflection",
      },
      {
        title: "Gentle Movement Only",
        instruction:
          "Don't push. A short walk, gentle stretching, or just changing rooms. Movement helps process residual stress hormones without adding new stress.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Reframe Yesterday",
        instruction:
          "You had a hard day. You made it through. What would you say to a friend who went through what you went through? Say that to yourself.",
        type: "text-input",
        placeholder: "What I'd say to a friend...",
      },
      {
        title: "Check In",
        instruction:
          "How are you feeling right now? Not how you 'should' be — how are you actually?",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 27. PERFECTIONISM ──────────────────────────────────────────────────
  {
    slug: "perfectionism",
    title: "Nothing Is Ever Good Enough: Working Through Perfectionism",
    metaTitle: "Perfectionism: How to Stop Setting Impossible Standards",
    metaDescription:
      "Trapped by impossible standards? This evidence-based protocol helps you understand perfectionism, challenge all-or-nothing thinking, and practice 'good enough.'",
    keywords: "perfectionism, how to overcome perfectionism, perfectionist thinking, all or nothing thinking",
    subtitle: "For when 99% right still feels like failure",
    time: "6 minutes",
    modality: "CBT",
    origin:
      "Based on CBT protocols for perfectionism, incorporating research on adaptive vs. maladaptive perfectionism.",
    whatThisIs:
      "It's never enough. No matter how well something goes, you see the flaw. The mistake. What you could have done better. Achievements don't register; failures echo. And so you procrastinate, because starting means the possibility of imperfection — and imperfection feels unbearable.\n\nPerfectionism isn't about high standards. High standards motivate. Perfectionism paralyzes. The difference is that perfectionism ties your worth to your output — if it's not perfect, you're not okay. This is exhausting and, ironically, makes you less effective because the fear of imperfection prevents the action that leads to competence.\n\nThis protocol helps you distinguish between healthy striving and toxic perfectionism, challenge the all-or-nothing thinking that makes everything feel like failure, and practice 'good enough' — which, it turns out, is often actually better than perfect because it gets done.",
    neuroscience:
      "Perfectionism correlates with heightened activity in error-monitoring brain circuits (anterior cingulate cortex) and reduced activity in reward circuits. The brain interprets 'not perfect' as 'error,' generating a continuous error signal. This creates chronic stress. All-or-nothing thinking is a cognitive distortion reinforced by neural pathways that don't recognize middle states. Practicing 'good enough' literally rewires these pathways, teaching the brain to recognize 'sufficient' as 'success.'",
    whenToUse: [
      "When you're procrastinating because you can't do it perfectly",
      "When you can't enjoy achievements because you see only flaws",
      "When 'good enough' feels like settling",
      "When you're stuck tweaking something that's already fine",
      "When comparison to an ideal makes you feel like a failure",
    ],
    relatedSlugs: ["cognitive-distortions", "self-compassion-break"],
    faqs: [
      {
        q: "Is perfectionism the same as having high standards?",
        a: "No. High standards are motivating and flexible. Perfectionism is rigid and paralyzing. You can want to do well without believing that anything less than perfect makes you worthless.",
      },
      {
        q: "Will lowering my standards make me less successful?",
        a: "Research shows the opposite. Perfectionism correlates with burnout, procrastination, and decreased performance over time. 'Good enough' allows for completion, iteration, and sustainable effort.",
      },
      {
        q: "What if I'm in a field where perfection actually matters?",
        a: "There's a difference between precision in high-stakes domains and perfectionism in all of life. A surgeon should be precise in surgery. That doesn't mean they need to send perfect emails or have a perfect home.",
      },
    ],
    steps: [
      {
        title: "Name the Perfectionist Thought",
        instruction:
          "What's the situation? What's the perfect standard you're holding yourself to?",
        type: "text-input",
        placeholder: "I'm expecting myself to...",
      },
      {
        title: "Is This Standard Realistic?",
        instruction:
          "Would you expect this from a friend? Would anyone reasonable expect this? Is this a standard that serves you or hurts you?",
        type: "reflection",
      },
      {
        title: "Find the Middle",
        instruction:
          "What would 'good enough' look like? Not perfect. Not terrible. A solid B+. Write it down.",
        type: "text-input",
        placeholder: "'Good enough' would be...",
      },
      {
        title: "What's the Cost of Perfection?",
        instruction:
          "What are you losing while you aim for perfect? Time? Energy? The ability to finish? Your health? The cost is real.",
        type: "reflection",
      },
      {
        title: "Practice Good Enough",
        instruction:
          "Try this: set a timer for half the time you'd normally spend. Do it to 'good enough' standard. Let it be imperfect. Let it be done.",
        type: "timer",
        duration: 60,
      },
      {
        title: "Notice",
        instruction:
          "Did the world end? Did you survive doing it imperfectly? Notice: good enough was enough.",
        type: "rating",
        min: 1,
        max: 10,
      },
    ],
  },

  // ─── 28. REJECTION SENSITIVITY ───────────────────────────────────────────
  {
    slug: "rejection-sensitivity",
    title: "When Rejection Hits Too Hard: Managing Rejection Sensitivity",
    metaTitle: "Rejection Sensitivity: When No Feels Like Devastation",
    metaDescription:
      "Does rejection feel crushing? This evidence-based protocol helps you manage rejection sensitivity and respond to perceived rejection with resilience.",
    keywords: "rejection sensitivity, RSD, fear of rejection, handling rejection",
    subtitle: "For when 'no' feels like devastation and criticism feels like destruction",
    time: "6 minutes",
    modality: "CBT",
    origin:
      "Based on CBT protocols for rejection sensitivity, with relevance to Rejection Sensitive Dysphoria (RSD) often seen in ADHD.",
    whatThisIs:
      "Someone says 'no' — and it hits like a punch. A hint of criticism, and you're spiraling. Rejection hits you harder than it seems to hit others, and the pain is real, not dramatic. This is rejection sensitivity — and for some, it's called Rejection Sensitive Dysphoria (RSD).\n\nRejection sensitivity means your nervous system treats social rejection or perceived rejection as a genuine threat. A 'no' isn't just disappointment; it's a signal that you're wrong, unlovable, or in danger of being cast out. This can make you avoid relationships (too risky), over-perform to avoid rejection, or ruminate for days on the smallest interaction.\n\nThis protocol helps you distinguish between what was actually said (reality) and what your brain is interpreting (the rejection story). It won't make rejection pleasant, but it can reduce the devastation so you can recover faster and maintain your relationships and self-worth.",
    neuroscience:
      "Social rejection can feel intensely activating, and some people seem especially sensitive to it. Pain and threat networks are both involved in social hurt, which helps explain why rejection can feel physically devastating. The CBT move here is to slow down the interpretation process so the first rejection story is not automatically treated as fact.",
    whenToUse: [
      "After getting a 'no' or perceived rejection",
      "When you're replaying an interaction looking for rejection",
      "When criticism feels like an attack on your character",
      "When you're considering avoiding something to prevent possible rejection",
      "When you're spiraling about what someone 'really meant'",
    ],
    relatedSlugs: ["cognitive-restructuring", "self-compassion-break"],
    faqs: [
      {
        q: "Is rejection sensitivity the same as RSD?",
        a: "RSD (Rejection Sensitive Dysphoria) is a term often used in the ADHD community to describe intense rejection pain. Rejection sensitivity is the broader concept. Not everyone with rejection sensitivity has ADHD, and not everyone with ADHD has RSD — but there's significant overlap.",
      },
      {
        q: "Can rejection sensitivity be 'cured'?",
        a: "It can be significantly reduced. CBT and awareness help you respond differently, which over time changes neural pathways. But many people with rejection sensitivity find that accepting their heightened sensitivity (and building skills around it) is more helpful than trying to eliminate it.",
      },
      {
        q: "What if they actually ARE rejecting me?",
        a: "Sometimes rejection is real. The technique doesn't deny that. It helps you see if rejection IS real, and if it is, respond with resilience rather than devastation. Real rejection hurts — but it doesn't have to mean you're worthless.",
      },
    ],
    steps: [
      {
        title: "What Happened?",
        instruction:
          "What was the actual event? Not your interpretation — the facts. What was said or done?",
        type: "text-input",
        placeholder: "What actually happened was...",
      },
      {
        title: "What's the Rejection Story?",
        instruction:
          "What is your brain telling you this means? 'They don't like me.' 'I'm annoying.' 'I messed up.' Write the story your mind generated.",
        type: "text-input",
        placeholder: "My brain is telling me...",
      },
      {
        title: "Fact-Check the Story",
        instruction:
          "What evidence do you have FOR this rejection story? What evidence do you have AGAINST it? Be a scientist, not your own worst critic.",
        type: "multi-input",
        fields: [
          "Evidence for rejection:",
          "Evidence against rejection:",
        ],
      },
      {
        title: "The Most Likely Truth",
        instruction:
          "Setting aside both the worst interpretation and wishful thinking, what's most likely actually happening?",
        type: "text-input",
        placeholder: "What's most likely true is...",
      },
      {
        title: "Even If...",
        instruction:
          "Even if there WAS rejection in this situation, what does it actually mean? Does one 'no' define you? Does this person's opinion determine your worth?",
        type: "reflection",
      },
      {
        title: "Self-Compassion Statement",
        instruction:
          "Say to yourself: 'It makes sense that this hurts. My sensitivity isn't weakness. I can feel this AND know I'm okay.'",
        type: "reflection",
      },
    ],
  },

  // ─── 29. THOUGHT SPIRAL ──────────────────────────────────────────────────
  {
    slug: "thought-spiral",
    title: "Breaking the Overthinking Loop: How to Stop a Thought Spiral",
    metaTitle: "Thought Spirals: How to Stop Overthinking and Break the Loop",
    metaDescription:
      "Stuck in an overthinking loop? This evidence-based protocol helps you interrupt the spiral and redirect your mind. Based on CBT and mindfulness.",
    keywords: "thought spiral, overthinking loop, how to stop overthinking, rumination",
    subtitle: "For when your brain is spinning and won't stop",
    time: "5 minutes",
    modality: "CBT/Mindfulness",
    origin:
      "Combines CBT rumination protocols with mindfulness-based cognitive techniques for thought spirals.",
    whatThisIs:
      "It starts with one thought. Then another. Then another. Before you know it, you're 47 steps into a catastrophe that hasn't happened, replaying the same scenario, arguing with imaginary conversations, unable to find the exit. This is a thought spiral, and it feeds on itself.\n\nOverthinking isn't productive problem-solving. It's a loop. The more you think, the more problems you 'find,' and the more anxious you get, which makes thinking clearly harder, which feeds the spiral. It's exhausting, it's unproductive, and it feels impossible to stop.\n\nThis protocol interrupts the spiral using a combination of physical grounding (bringing you back to your body), cognitive anchoring (giving your mind something else to do), and evidence-checking (challenging the spiral's assumptions). You don't have to solve the problem to stop the spiral — sometimes you just need to get off the ride.",
    neuroscience:
      "Thought spirals often feed themselves: the more worked up you feel, the harder it is to think clearly, and the harder it is to think clearly, the more convincing the spiral becomes. The goal of this technique is not to solve everything instantly. It is to shift attention, give your mind a structured task, and lower the level of activation enough that you can regain perspective.",
    whenToUse: [
      "When your mind is racing and won't stop",
      "When you're catastrophizing future scenarios",
      "When you've been thinking about the same thing for 30+ minutes",
      "When you're stuck rehearsing conversations that haven't happened",
      "When worry feels like it has momentum you can't halt",
    ],
    relatedSlugs: ["thought-defusion", "54321-grounding"],
    faqs: [
      {
        q: "What's the difference between thinking and overthinking?",
        a: "Productive thinking moves toward a decision or solution. Overthinking loops without resolution. If you've been thinking about the same thing for more than 20 minutes with no new insights, you're overthinking.",
      },
      {
        q: "Is overthinking the same as anxiety?",
        a: "Overthinking is often a symptom of anxiety, but they're not identical. You can overthink without an anxiety disorder, and anxiety can show up without spiraling thoughts. They often go together, though.",
      },
      {
        q: "Why can't I just tell myself to stop?",
        a: "Because 'don't think of a white bear' makes you think of white bears. Fighting the thought gives it more power. This technique redirects rather than suppresses — giving your brain something productive to do instead.",
      },
    ],
    steps: [
      {
        title: "Catch It",
        instruction:
          "Notice: 'I'm in a thought spiral.' Naming it creates a tiny gap between you and the thoughts.",
        type: "reflection",
      },
      {
        title: "Physical Reset",
        instruction:
          "Stand up. Shake your body. Splash cold water on your face. Do something physical. The spiral lives in your head; get into your body.",
        type: "timer",
        duration: 30,
      },
      {
        title: "5-4-3-2-1 Grounding",
        instruction:
          "Name 5 things you see, 4 things you touch, 3 things you hear. This forces your brain into sensory processing, which can't run the spiral at the same time.",
        type: "reflection",
      },
      {
        title: "Externalize It",
        instruction:
          "Write down the spiral. Don't edit — dump it out of your head and onto paper. Once it's external, it has less power.",
        type: "text-input",
        placeholder: "The spiral in my head is...",
      },
      {
        title: "The One Thing",
        instruction:
          "Of everything your spiral is covering, what's the ONE actionable issue? Just one. Write it down. Everything else can wait.",
        type: "text-input",
        placeholder: "The ONE actionable issue is...",
      },
      {
        title: "Breathe It Down",
        instruction:
          "Long slow exhales to signal safety to your nervous system. The spiral will try to start again. Let it pass and return to your breath.",
        type: "breathing",
        breathe: { inhale: 4, hold: 4, exhale: 8 },
        duration: 32,
      },
    ],
  },
];
