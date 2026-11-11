// ============================================================
// Fitforg app — vanilla JS module.
// Ported verbatim from the original single-file HTML app.
// Runs on import (deferred by Vite's module loading).
// Expects #app, #main, #nav, #splash to exist in the DOM
// (they're in index.html directly).
// ============================================================

import{notifySupported,notifyPermission,notifyAsk,notifyEnabled,notifyOn,notifyState}from'./notify.js';

const $=s=>document.querySelector(s);
const IC={eq_bw:'<circle cx="12" cy="4.5" r="2"/><path d="M5.5 9.5l6.5 1.5 6.5-1.5M12 11v4.5M12 15.5l-3 5.5M12 15.5l3 5.5"/>',eq_db:'<rect x="4" y="7" width="3" height="10" rx="1"/><rect x="17" y="7" width="3" height="10" rx="1"/><path d="M7 12h10M2 10v4M22 10v4"/>',eq_bar:'<path d="M3 4.5v5M21 4.5v5M3 7h18"/><circle cx="12" cy="10.5" r="1.8"/><path d="M8 7l2.5 5.5M16 7l-2.5 5.5M12 12.5v4.5M12 17l-2 4M12 17l2 4"/>',eq_band:'<rect x="2" y="8.5" width="3.5" height="7" rx="1.3"/><rect x="18.5" y="8.5" width="3.5" height="7" rx="1.3"/><path d="M5.5 12c2-4.5 4-4.5 6.5 0s4.5 4.5 6.5 0"/>',eq_kb:'<path d="M8.5 10.5v-3a3.5 3.5 0 0 1 7 0v3"/><circle cx="12" cy="15.5" r="5.5"/>',today:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M9 15.2l2.2 2.2 4.3-4.4"/>',stats:'<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',library:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/><path d="M9 7h7M9 11h7"/>',ex:'<path d="M3 12h2M19 12h2M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8"/>',wo:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 9h8M8 13h8M8 17h4"/>',gear:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',chk:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',save:'<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',saved:'<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" fill="currentColor"/>',srch:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',play:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',swap:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',skip:'<path d="M5 5l9 7-9 7zM19 5v14"/>',cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',chev:'<path d="m9 18 6-6-6-6"/>',eq_pb:'<path d="M3 10h7M14 10h7M4.5 10v8M8.5 10v8M15.5 10v8M19.5 10v8M2 18.5h20"/>',eq_bag:'<path d="M8.5 6.5a3.5 3.5 0 0 1 7 0"/><rect x="5" y="6.5" width="14" height="14.5" rx="4"/><path d="M9 14h6M9 17.5h6"/>'};
const ic=(n,s=20,w=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
// id|name|muscle|equipment|motion|sets|reps|rest|steps;|tip|swap
const E={};`squat-goblet|Goblet Squat|Legs|db|squat|3|12|75|Hold one dumbbell upright at your chest, elbows pointing down.;Sit your hips back and down until your thighs are parallel to the floor.;Drive through your whole foot to stand tall.|Keep your chest up and knees over your toes.|squat
squat|Bodyweight Squat|Legs|bw|squat|3|15|60|Stand shoulder-width apart, toes slightly out, arms in front.;Push your hips back and bend your knees, lowering to parallel.;Press through your heels to stand back up.|Don’t let your knees cave inward.|
db-lunge|Walking Lunge|Legs|db|lunge|3|12|75|Hold a dumbbell in each hand at your sides.;Step forward and lower until both knees reach 90°.;Push off the front foot and step the back leg through.|Keep your torso upright and take long steps.|lunge-rev
lunge-rev|Reverse Lunge|Legs|bw|lunge|3|10|60|Stand tall with hands on your hips.;Step one foot back and lower until both knees bend to 90°.;Push through the front heel to stand.|Keep the front knee above your ankle.|
rdl|Romanian Deadlift|Legs|db|hinge|3|10|75|Hold dumbbells in front of your thighs with soft knees.;Push your hips straight back, sliding the weights down your legs.;Stop at mid-shin, then drive your hips forward to stand.|Feel it in your hamstrings, not your lower back.|goodmorning
goodmorning|Good Morning|Legs|bw|hinge|3|12|45|Place your hands behind your head, feet hip-width.;Hinge at the hips, pushing them back with a flat back.;Squeeze your glutes to rise.|Keep your spine long the whole time.|
db-calf-raise|Dumbbell Calf Raise|Legs|db|calf|3|15|45|Stand holding dumbbells at your sides.;Rise onto the balls of your feet as high as you can.;Pause for a second, then lower slowly.|Lowering slowly builds the most strength.|calf
calf|Calf Raise|Legs|bw|calf|3|20|45|Stand with feet hip-width, one hand on a wall.;Rise onto your toes.;Lower slowly to the floor.|Pause at the top of every rep.|
bridge|Glute Bridge|Legs|bw|bridge|3|15|45|Lie on your back with knees bent, feet flat.;Drive through your heels to lift your hips.;Squeeze at the top, then lower with control.|Don’t arch your lower back.|
pushup|Push-up|Chest|bw|push|3|12|60|Hands just wider than your shoulders, body in one straight line.;Lower your chest toward the floor, elbows about 45° from your body.;Press back up to full arm extension.|Brace your core so your hips don’t sag.|
pushup-close|Close-grip Push-up|Arms|bw|push|3|10|60|Place your hands under your shoulders, thumbs close.;Lower with elbows tucked against your ribs.;Press up hard through your triceps.|Drop to your knees if you need to.|
dip|Bench Dip|Arms|bw|push|3|12|60|Sit on a chair edge, hands beside your hips, legs forward.;Slide off and lower until elbows reach 90°.;Press back up without shrugging.|Keep your back close to the chair.|
pike|Pike Push-up|Shoulders|bw|push|3|8|60|Start in a downward-dog shape with hips high.;Bend your elbows to lower your head toward the floor.;Press back up.|Keep your hips high throughout.|
press|Dumbbell Shoulder Press|Shoulders|db|press|3|10|75|Hold dumbbells at shoulder height, palms forward.;Press up until your arms are straight.;Lower back to shoulder height.|Brace your core; don’t lean back.|pike
row|Dumbbell Row|Back|db|row|3|12|75|Hinge forward with a flat back, dumbbells hanging.;Pull the weights to your ribs, squeezing your shoulder blades.;Lower slowly.|Lead with your elbows, not your hands.|towel-row
towel-row|Towel Doorway Row|Back|bw|row|3|12|75|Loop a towel around a sturdy door handle and lean back.;Pull your chest toward the door.;Lower slowly.|Make sure the door is closed and solid.|
pullup|Pull-up|Back|bar|pull|3|6|90|Hang from the bar, hands just wider than your shoulders.;Pull until your chin clears the bar.;Lower fully with control.|Avoid swinging your legs.|towel-row
band-apart|Band Pull-apart|Back|band|row|3|15|45|Hold a band at chest height, arms straight.;Pull the band apart until your arms reach your sides.;Return slowly.|Keep your shoulders down.|towel-row
curl|Dumbbell Curl|Arms|db|curl|3|12|60|Stand with dumbbells at your sides, palms forward.;Curl up, keeping your elbows pinned to your ribs.;Lower slowly.|No swinging.|towel-curl
towel-curl|Isometric Towel Curl|Arms|bw|curl|3|30s|45|Stand on a towel and hold both ends.;Pull up hard as if curling while your foot resists.;Hold the tension.|Breathe steadily.|
plank|Plank|Core|bw|plank|3|45s|30|Rest on your forearms, elbows under your shoulders.;Make a straight line from head to heels.;Squeeze your glutes and abs and hold.|Don’t let your hips drop.|
deadbug|Dead Bug|Core|bw|crunch|3|12|30|Lie on your back, arms up, knees bent over your hips.;Lower the opposite arm and leg toward the floor.;Return and switch sides.|Keep your lower back pressed down.|
bicycle|Bicycle Crunch|Core|bw|crunch|3|20|30|Put your hands behind your head and lift your legs.;Bring one elbow toward the opposite knee.;Switch sides in a pedalling motion.|Rotate your torso; don’t pull your neck.|
climber|Mountain Climber|Cardio|bw|climb|3|30s|30|Start in a high plank.;Drive one knee toward your chest.;Switch legs quickly.|Keep your hips level.|
swing|Kettlebell Swing|Cardio|kb|hinge|4|15|45|Hinge with the kettlebell between your legs.;Snap your hips forward to swing it to chest height.;Let it fall back and hinge again.|The power comes from your hips, not your arms.|squat-jump
squat-jump|Squat Jump|Cardio|bw|squat|3|10|60|Lower into a squat.;Explode upward.;Land softly and go straight into the next squat.|Land with soft knees.|
burpee|Burpee|Cardio|bw|climb|3|8|60|Squat down and place your hands on the floor.;Jump your feet back to a plank, then jump them in.;Jump up with your arms overhead.|Slow the pace to keep your form.|
catcow|Cat–Cow|Mobility|bw|cat|2|10|20|Get on your hands and knees.;Arch your back, lifting your head and tailbone.;Round your spine and tuck your chin.|Move with your breath.|
wgs|World’s Greatest Stretch|Mobility|bw|lunge|2|6|20|Step into a deep lunge.;Place both hands inside your front foot.;Rotate one arm up to the ceiling.|Hold the rotation for a full breath.|
hip90|Hip 90/90|Mobility|bw|squat|2|8|20|Sit with both knees bent at 90°.;Rotate your knees from side to side.;Keep your torso tall.|Move slowly.|
kb-goblet|Kettlebell Goblet Squat|Legs|kb|squat|3|12|75|Hold the kettlebell by the horns at your chest.;Sit your hips back and down, elbows inside your knees.;Drive through your feet to stand tall.|Keep the bell close and your chest up.|squat
kb-deadlift|Kettlebell Deadlift|Legs|kb|hinge|3|12|75|Stand over the bell, feet hip-width, and hinge back to grip the handle.;Flatten your back and push the floor away to stand.;Squeeze your glutes at the top, then hinge back down.|Push your hips back instead of squatting it.|goodmorning
kb-row|Kettlebell Row|Back|kb|row|3|12|60|Hinge forward with a flat back, one hand on a chair, bell in the other hand.;Pull the bell to your hip, elbow close to your ribs.;Lower slowly to a full stretch.|Lead with your elbow, not your hand.|towel-row
kb-press|Kettlebell Overhead Press|Shoulders|kb|press|3|8|75|Hold the bell at shoulder height with a straight wrist.;Press straight up until your arm locks out by your ear.;Lower under control back to your shoulder.|Squeeze your glutes so your back doesn’t arch.|pike
kb-lunge|Kettlebell Reverse Lunge|Legs|kb|lunge|3|10|60|Hold the bell at your chest in both hands.;Step one foot back and lower both knees to about 90°.;Push through the front heel to stand.|Keep the bell close and your torso tall.|lunge-rev
band-squat|Banded Squat|Legs|band|squat|3|15|60|Stand on the band, feet shoulder-width, ends held at your shoulders.;Sit your hips back and down to parallel.;Drive up against the band’s pull.|Keep your knees tracking over your toes.|squat
band-row|Banded Row|Back|band|row|3|15|60|Anchor the band around a sturdy post or your feet.;Pull the handles to your ribs, squeezing your shoulder blades.;Return slowly without letting the band snap back.|Keep your shoulders down, don’t shrug.|towel-row
band-press|Banded Overhead Press|Shoulders|band|press|3|12|60|Stand on the band and hold the ends at your shoulders.;Press both hands straight overhead.;Lower slowly back to your shoulders.|Keep your ribs down and glutes tight.|pike
band-curl|Banded Biceps Curl|Arms|band|curl|3|15|45|Stand on the band, palms forward, elbows by your sides.;Curl your hands up to your shoulders.;Lower slowly, keeping tension.|Keep your elbows pinned to your ribs.|towel-curl
band-gm|Banded Good Morning|Legs|band|hinge|3|12|60|Stand on the band and loop it over your shoulders.;Hinge at the hips with a flat back.;Squeeze your glutes to stand.|Keep your back flat the whole way.|goodmorning
band-bridge|Banded Glute Bridge|Legs|band|bridge|3|15|45|Lie on your back with a loop band just above your knees.;Press your knees out against the band and lift your hips.;Squeeze your glutes at the top, then lower.|Don’t let your knees cave in.|bridge
chinup|Chin-up|Back|bar|pull|3|6|90|Hang from the bar with palms facing you, hands shoulder-width.;Pull your chest toward the bar until your chin clears it.;Lower slowly to a full hang.|Squeeze your biceps and lats together.|towel-row
wide-pullup|Wide-grip Pull-up|Back|bar|pull|3|5|90|Hang with hands wider than your shoulders, palms forward.;Pull your elbows down until your chin clears the bar.;Lower slowly to a full hang.|Think about driving your elbows to your hips.|towel-row
neg-pullup|Negative Pull-up|Back|bar|pull|3|5|90|Step up so your chin is over the bar.;Lower yourself as slowly as you can, about 4 seconds.;Reach a full hang, then step back up.|A slow lowering builds the strength for full pull-ups.|towel-row
db-sumo|Dumbbell Sumo Squat|Legs|db|squat|3|12|75|Stand with feet wide, toes out, one dumbbell hanging between your legs.;Sit straight down until your thighs are parallel.;Press through your heels to stand.|Keep your knees in line with your toes.|squat
db-rev-lunge|Dumbbell Reverse Lunge|Legs|db|lunge|3|10|75|Hold a dumbbell in each hand at your sides.;Step one foot back and lower both knees to 90°.;Push through the front heel to stand.|Keep your torso upright.|lunge-rev
db-bent-row|Bent-over Dumbbell Row|Back|db|row|3|12|60|Hinge forward with a flat back, a dumbbell in each hand.;Pull both weights to your hips, squeezing your shoulder blades.;Lower under control.|Keep your back flat and don’t swing.|towel-row
db-hammer|Hammer Curl|Arms|db|curl|3|12|45|Hold dumbbells with palms facing each other.;Curl up without turning your wrists.;Lower slowly.|Keep your elbows pinned to your ribs.|towel-curl
db-arnold|Arnold Press|Shoulders|db|press|3|10|75|Hold dumbbells at chin height, palms facing you.;Rotate your palms forward as you press overhead.;Reverse the rotation as you lower.|Move smoothly and don’t shrug.|pike
db-bridge|Dumbbell Glute Bridge|Legs|db|bridge|3|12|60|Lie on your back, knees bent, a dumbbell resting on your hips.;Drive your hips up until your body is a straight line.;Squeeze your glutes, then lower.|Keep your ribs down and don’t arch your back.|bridge
sumo-squat|Sumo Squat|Legs|bw|squat|3|15|60|Stand with feet wide, toes turned out.;Sit straight down between your knees.;Press through your heels to stand.|Keep your knees tracking over your toes.|
wide-pushup|Wide Push-up|Chest|bw|push|3|12|60|Place your hands wider than your shoulders.;Lower your chest toward the floor, body in a straight line.;Press back up.|Keep your hips from sagging.|
diamond-pushup|Diamond Push-up|Arms|bw|push|3|8|60|Make a diamond with your thumbs and index fingers under your chest.;Lower until your chest touches your hands.;Press back up.|Keep your elbows close to your body.|
sl-bridge|Single-leg Glute Bridge|Legs|bw|bridge|3|10|60|Lie on your back, one foot planted, the other leg extended.;Drive your hips up through the planted heel.;Lower slowly, then switch sides.|Keep your hips level.|
incline-pushup|Incline Push-up|Chest|bw|inc|3|12|60|Place your hands on a sturdy table, counter or sofa edge, body in a straight line.;Lower your chest toward the edge.;Press back up without letting your hips sag.|The higher your hands, the easier it gets.|
decline-pushup|Decline Push-up|Chest|bw|dec|3|8|60|Put your feet on a sturdy chair or sofa and your hands on the floor, wider than your shoulders.;Lower your chest toward the floor, body in a straight line.;Press back up.|Keep your core tight so your hips don’t drop.|
knee-pushup|Knee Push-up|Chest|bw|kpush|3|10|60|Kneel and place your hands on the floor under your shoulders.;Lower your chest toward the floor, body straight from knees to head.;Press back up.|A great way to build up to full push-ups.|
pause-pushup|Pause Push-up|Chest|bw|push|3|8|60|Start in a high plank with hands under your shoulders.;Lower until your chest is just above the floor and hold for 2 seconds.;Press up powerfully.|Don’t rest your chest on the floor during the pause.|
clap-pushup|Explosive Push-up|Chest|bw|push|3|6|75|Start in a high plank, body straight.;Lower with control, then push up hard so your hands leave the floor.;Land softly with bent elbows and go again.|Only try this once normal push-ups feel easy.|
stagger-pushup|Staggered-hand Push-up|Chest|bw|push|3|10|60|Start in a high plank with one hand slightly forward of the other.;Lower your chest toward the floor.;Press up, then switch which hand is forward each set.|Keep your shoulders level as you lower.|
band-pushup|Banded Push-up|Chest|band|push|3|10|75|Loop the band across your upper back, holding the ends under your palms.;Lower your chest toward the floor, body straight.;Press up against the band’s pull.|Keep the band flat across your shoulder blades.|pushup
db-floor-press|Dumbbell Floor Press|Chest|db|fpress|3|12|75|Lie on your back, knees bent, a dumbbell in each hand over your chest.;Lower until your upper arms lightly touch the floor.;Press the weights back up until your arms are straight.|Keep your wrists straight and elbows about 45° from your body.|pushup
db-squeeze-press|Dumbbell Squeeze Press|Chest|db|fpress|3|12|60|Lie on your back holding two dumbbells together over your chest.;Press them together hard as you lower to your chest.;Keep squeezing as you press up.|Squeeze the dumbbells the whole time to light up your chest.|pushup
band-chest-press|Banded Chest Press|Chest|band|bpress|3|15|60|Anchor the band behind you, or wrap it across your back, and hold the ends at chest height.;Press both hands straight forward until your arms are straight.;Return slowly without letting the band snap back.|Keep your shoulders down and your core tight.|pushup`.split("\n").forEach(l=>{const[id,name,m,eq,p,s,r,rs,st,tp,alt]=l.split("|");E[id]={id,name,m,eq,p,s:+s,r,rs:+rs,st:st.split(";"),tp,alt}});
"goodmorning:gm,towel-row:inrow,band-apart:band,towel-curl:tcurl,deadbug:deadbug,bicycle:bicycle,swing:swing,squat-jump:sj,burpee:burpee,wgs:wgs,hip90:hip90,dip:dip,pike:pike".split(",").forEach(x=>{const[i,p]=x.split(":");E[i].p=p});
// id|corrected steps (blank = keep)|form checks|common mistake
`squat-goblet||Chest tall, elbows inside knees~Knees track over toes~Heels stay flat|Heels lifting or knees caving in
squat||Chest up, eyes forward~Knees track over toes~Heels stay flat|Knees collapsing inward or rounding your back
db-lunge||Torso upright~Front knee over ankle~Back knee hovers near floor|Tiny steps, or front knee drifting past your toes
lunge-rev||Hips square, torso tall~Front shin near vertical~Push through the front heel|Leaning forward or stepping back too short
rdl|Hold dumbbells in front of your thighs, knees slightly bent.;Push your hips back, sliding the weights close to your legs with a flat back.;Lower until you feel a hamstring stretch (about mid-shin), then drive your hips forward to stand.|Back stays flat~Weights slide along your legs~Hips go back, not down|Rounding your back or squatting the weight down
goodmorning||Hands light behind your head~Back flat, neck neutral~Knees softly bent|Rounding the spine or locking your knees
db-calf-raise||Rise straight up, no wobble~Pause 1s at the top~Lower for 2–3s|Bouncing through the rep
calf||Heels as high as possible~Pause at the top~Lower slowly|Rolling your ankles outward
bridge||Ribs down, no back arch~Squeeze glutes at the top~Push the floor away with your heels|Arching your lower back to get higher
pushup||Body is one straight line~Elbows about 45° from your torso~Chest nearly touches the floor|Sagging hips or flaring elbows out to 90°
pushup-close||Hands under shoulders~Elbows brush your ribs~Body stays straight|Elbows flaring wide
dip|Sit on the edge of a sturdy chair with hands gripping beside your hips and legs out in front.;Slide your hips off the seat with arms straight.;Bend your elbows straight back to about 90°, then press up.|Elbows point straight back~Hips stay close to the chair~Shoulders away from ears|Going deeper than 90° or flaring elbows
pike||Hips high, body an inverted V~Head goes between your hands~Elbows bend to about 90°|Letting hips drop into a push-up
press||Ribs down, glutes tight~Press in a straight line~Full lockout overhead|Arching your lower back
row||Back flat, neck neutral~Elbow brushes your ribs~Squeeze the shoulder blade|Twisting the torso or yanking with the arm
towel-row||Body in one straight line~Pull elbows back, not shoulders up~Door closed and solid|Letting hips sag or shrugging
pullup|Hang from the bar, hands just wider than your shoulders, shoulders pulled down away from your ears.;Pull your elbows down toward your ribs until your chin clears the bar.;Lower slowly to a full hang.|Start from a full hang~Chin clears the bar~Control the way down|Kipping or half reps
band-apart||Arms straight at chest height~Squeeze shoulder blades~Shoulders stay down|Shrugging or arching your back
curl||Elbows pinned to your ribs~Full range, no swing~Wrists stay straight|Swinging your body to lift
towel-curl||Elbows bent at 90°~Keep tension the whole time~Breathe steadily|Holding your breath
plank||Straight line from head to heels~Elbows under shoulders~Glutes and abs tight|Hips sagging or piking up
deadbug|Lie on your back with arms straight up and knees bent at 90° over your hips.;Press your lower back into the floor and keep it there.;Slowly lower the opposite arm and leg toward the floor, then return and switch.|Lower back stays on the floor~Move slowly~Opposite arm and leg|Lower back arching off the floor
bicycle||Rotate your shoulder, not just the elbow~Neck relaxed~Slow, controlled twist|Pulling on your neck
climber||Shoulders over wrists~Hips level~Drive knees fast|Hips bouncing up
swing|Stand feet shoulder-width apart with the kettlebell a foot in front. Hinge back and hike it behind your legs.;Snap your hips forward hard so the bell floats to chest height. Your arms only guide it.;Let it fall, hinge back and repeat.|Hips, not arms, lift the bell~Back flat at the bottom~Stand fully tall at the top|Squatting it or lifting with your arms
squat-jump||Land softly~Knees over toes~Reset between jumps|Landing with stiff, straight legs
burpee|Stand tall, then squat and place your hands on the floor.;Jump or step your feet back to a high plank.;Return your feet to your hands and jump up with arms overhead.|Straight plank, no sagging~Land softly~Steady pace|Letting your hips sag in the plank
catcow||Hands under shoulders, knees under hips~Move one vertebra at a time~Match your breath|Rushing the movement
wgs|Step into a deep lunge with the back knee off the floor.;Place both hands inside your front foot.;Rotate the inside arm up to the ceiling, following it with your eyes, then return.|Front knee over ankle~Chest rotates fully~Back leg stays straight|Rushing the rotation
hip90|Sit with both knees bent at 90°, one in front and one to the side.;Keeping your feet on the floor, rotate both knees to the other side.;Keep your torso tall as you switch.|Torso stays tall~Move slowly~Knees stay near 90°|Leaning back to cheat the rotation
kb-goblet||Chest tall, elbows inside knees~Bell stays close to your chest~Thighs reach parallel|Letting the bell drift away from your body
kb-deadlift||Back flat, bell close to your legs~Hips go back first~Stand fully tall at the top|Rounding your back or squatting the weight
kb-row||Back flat, neck neutral~Elbow brushes your ribs~Squeeze the shoulder blade|Twisting your torso or yanking the bell
kb-press||Wrist straight, bell close~Press in a straight line~Full lockout by your ear|Arching your lower back
kb-lunge||Torso tall, bell at chest~Front knee over ankle~Back knee hovers near the floor|Leaning forward or a short step back
band-squat||Chest up, band stays tight~Knees over toes~Thighs reach parallel|Knees caving inward
band-row||Shoulder blades squeeze together~Elbows brush your ribs~Slow return|Shrugging or letting the band snap back
band-press||Ribs down, glutes tight~Press in a straight line~Full lockout overhead|Arching your lower back
band-curl||Elbows pinned to your ribs~Full range, no swing~Wrists stay straight|Swinging your body to lift
band-gm||Back flat, neck neutral~Hips go back, not down~Knees softly bent|Rounding the spine
band-bridge||Ribs down, no back arch~Knees press out on the band~Squeeze glutes at the top|Knees collapsing inward
chinup||Start from a full hang~Chin clears the bar~Control the way down|Kipping or half reps
wide-pullup||Start from a full hang~Elbows drive down and back~Chin clears the bar|Kipping or half reps
neg-pullup||Start with chin over the bar~Lower for about 4 seconds~Reach a full hang|Dropping quickly
db-sumo||Chest tall, knees over toes~Weight hangs between your legs~Thighs reach parallel|Knees caving inward
db-rev-lunge||Torso tall, hips square~Front shin near vertical~Push through the front heel|Leaning forward or a short step back
db-bent-row||Back flat, neck neutral~Elbows brush your ribs~Squeeze the shoulder blades|Swinging the weights
db-hammer||Palms face each other~Elbows pinned to your ribs~Slow lowering|Swinging your body to lift
db-arnold||Smooth rotation, no shrug~Press in a straight line~Full lockout overhead|Arching your lower back
db-bridge||Ribs down, no back arch~Squeeze glutes at the top~Push the floor away with your heels|Arching your lower back
sumo-squat||Wide stance, toes turned out~Knees track over toes~Chest stays tall|Knees caving inward
wide-pushup||Body is one straight line~Hands wider than shoulders~Chest nearly touches the floor|Sagging hips or flaring elbows past 90°
diamond-pushup||Hands form a diamond under your chest~Elbows brush your ribs~Body stays straight|Elbows flaring wide
sl-bridge||Hips stay level~Squeeze the glute of the planted leg~Ribs down|Rotating your hips or arching your back
incline-pushup||Body is one straight line~Hands just wider than shoulders~Chest reaches the edge|Sagging hips or flaring elbows
decline-pushup||Body is one straight line~Hands wider than shoulders~Chest nearly touches the floor|Sagging hips or a flared head
knee-pushup||Straight line from knees to head~Hands under shoulders~Chest nearly touches the floor|Sticking your hips up in the air
pause-pushup||Body is one straight line~Hold 2s just above the floor~Press up smoothly|Resting on the floor during the pause
clap-pushup||Body stays straight~Hands fully leave the floor~Land with soft elbows|Landing on locked, straight arms
stagger-pushup||Shoulders stay level~Body is one straight line~Switch hands each set|Twisting your torso
band-pushup||Band flat across your upper back~Body is one straight line~Chest nearly touches the floor|Letting the band slip or sag your hips
db-floor-press||Wrists straight over elbows~Elbows about 45° from your body~Press to full lockout|Flaring elbows out to 90°
db-squeeze-press||Dumbbells squeezed together~Press in a straight line~Full lockout|Letting the weights drift apart
band-chest-press||Hands at chest height~Press to full reach~Slow return|Shrugging or letting the band snap back`.split("\n").forEach(l=>{const[i,st,ck,bad]=l.split("|"),e=E[i];if(st)e.st=st.split(";");e.ck=ck.split("~");e.bad=bad});
// new exercises: id|name|muscle|equipment|motion|sets|reps|rest|steps;|tip|fallback|form checks~|common mistake|level 1-3|household item
`crunch|Crunch|Core|bw|crunch|3|15|30|Lie on your back, knees bent, fingertips lightly behind your ears.;Curl your head and shoulders off the floor by squeezing your abs.;Lower slowly until your shoulders touch the floor.|Think ribs toward hips, not elbows toward knees.|deadbug|Lower back stays on the floor~Chin a fist away from your chest~Slow on the way down|Yanking your head forward with your hands|1|
rev-crunch|Reverse Crunch|Core|bw|revcrunch|3|12|30|Lie on your back, arms by your sides, knees bent over your hips.;Curl your hips off the floor, drawing your knees toward your chest.;Lower your hips slowly back down.|Lift with your abs, not by swinging your legs.|crunch|Knees stay bent~Hips curl, not kick~Lower slowly|Swinging your legs for momentum|2|
leg-raise|Lying Leg Raise|Core|bw|legraise|3|10|45|Lie flat with legs straight and hands under your hips.;Keeping your legs straight, lift them until they point at the ceiling.;Lower slowly, stopping just before your heels touch.|If your back arches, bend your knees slightly.|rev-crunch|Lower back pressed down~Legs straight and together~Stop just above the floor|Arching your lower back as the legs lower|2|
flutter|Flutter Kicks|Core|bw|flutter|3|30s|30|Lie on your back, hands under your hips, legs straight.;Lift both heels a few centimetres off the floor.;Kick your legs up and down in small, quick alternating moves.|Small kicks are harder than big ones.|deadbug|Lower back pressed down~Legs straight, toes pointed~Small, steady kicks|Letting your lower back lift off the floor|2|
side-plank|Side Plank|Core|bw|sideplank|3|30s|30|Lie on your side with your hand under your shoulder and legs stacked.;Lift your hips until your body forms a straight line.;Hold, then switch sides.|Drop to your forearm or bottom knee to make it easier.|plank|Hand under shoulder~Head, hips and feet in line~Hips stay high|Letting your hips sag toward the floor|2|
bird-dog|Bird Dog|Core|bw|birddog|3|10|30|Start on your hands and knees with a flat back.;Reach one arm forward and the opposite leg back until both are level with your body.;Return under control and switch sides.|Imagine a glass of water balanced on your lower back.|deadbug|Back stays flat~Hips level, no twist~Reach long, not high|Arching your back as the leg lifts|1|
hollow|Hollow Hold|Core|bw|hollow|3|20s|45|Lie on your back with arms overhead and legs straight.;Press your lower back into the floor and lift your shoulders and legs.;Hold the curved banana shape.|Bend your knees to make it easier.|deadbug|Lower back glued to the floor~Arms by your ears~Legs low but off the floor|Lower back peeling off the floor|3|
russian-twist|Russian Twist|Core|bw|twist|3|20|30|Sit with knees bent and lean back slightly with a straight back.;Clasp your hands in front of your chest.;Rotate your torso to bring your hands beside each hip.|Turn your shoulders, not just your arms.|bicycle|Chest tall, back straight~Rotate from the ribs~Feet down if you need balance|Rounding your back and only moving the arms|1|
plank-tap|Plank Shoulder Tap|Core|bw|planktap|3|20|30|Start in a high plank with feet a little wider than your hips.;Lift one hand and tap the opposite shoulder.;Place it back down and switch, keeping your hips still.|Widen your feet to make it easier.|plank|Hips stay level~Body in one straight line~Slow, controlled taps|Rocking your hips side to side|2|
v-up|V-up|Core|bw|vup|3|10|45|Lie flat with arms overhead and legs straight.;Lift your arms and legs at the same time and reach for your toes.;Lower back down with control.|Bend your knees into a tuck-up if you need to.|crunch|Arms and legs rise together~Reach for your toes~Lower slowly|Flopping back down with no control|3|
jumping-jack|Jumping Jack|Cardio|bw|jack|3|30s|30|Stand tall with feet together and arms by your sides.;Jump your feet out wide while swinging your arms overhead.;Jump back to the start and repeat.|Step one foot out at a time for a quieter, low-impact version.|high-knees|Arms reach fully overhead~Land softly, knees soft~Steady rhythm|Landing heavily on your heels|1|
high-knees|High Knees|Cardio|bw|highknee|3|30s|30|Stand tall with feet hip-width apart.;Drive one knee up to hip height while pumping the opposite arm.;Switch legs quickly in a running rhythm.|Stay on the balls of your feet.|jumping-jack|Knees reach hip height~Chest tall~Pump your arms|Leaning back as you tire|1|
butt-kick|Butt Kicks|Cardio|bw|buttkick|3|30s|30|Stand tall and start jogging on the spot.;Kick each heel up toward your glutes.;Keep a quick, light rhythm.|Keep your knees pointing down.|high-knees|Heels reach your glutes~Knees point down~Quick, light feet|Leaning forward at the hips|1|
skater|Skater Hop|Cardio|bw|skater|3|20|45|Stand on one leg with a slight bend in the knee.;Leap sideways and land softly on the other foot.;Sweep your trailing leg behind you, then leap back the other way.|Make the jump smaller to make it easier.|jumping-jack|Land softly on one foot~Knee over toes~Stick each landing|Landing with a stiff knee|2|
tuck-jump|Tuck Jump|Cardio|bw|tuck|3|8|60|Stand with feet hip-width and dip into a quarter squat.;Jump explosively and pull your knees toward your chest.;Land softly and reset before the next jump.|Quality over speed. Reset between reps.|squat-jump|Knees drive up high~Land soft and quiet~Reset before each jump|Landing on locked knees|3|
bear-crawl|Bear Crawl|Cardio|bw|bear|3|30s|45|Start on hands and knees, then lift your knees a few centimetres off the floor.;Crawl forward by moving the opposite hand and foot together.;Keep your back flat and hips low.|Small steps keep your hips steady.|bird-dog|Knees hover just off the floor~Back flat, hips low~Opposite hand and foot move together|Hips shooting up high|2|
shadow-box|Shadow Boxing|Cardio|bw|box|3|45s|30|Stand in a staggered stance with fists up by your chin.;Throw fast punches straight out, turning through your hips.;Snap each fist back to your chin.|Exhale sharply with every punch.|high-knees|Fists return to your chin~Rotate hips into each punch~Stay light on your feet|Dropping your guard between punches|1|
inchworm|Inchworm|Cardio|bw|inchworm|3|6|45|Stand tall and fold forward to put your hands on the floor.;Walk your hands out until you reach a high plank.;Walk your hands back to your feet and stand up.|Bend your knees as much as you need to reach the floor.|plank|Legs as straight as is comfortable~Reach a full plank~Walk back with control|Letting your hips sag in the plank|1|
childs-pose|Child’s Pose|Mobility|bw|child|2|30s|15|Kneel with big toes together and knees apart.;Sit your hips back toward your heels.;Reach your arms forward and rest your chest toward the floor.|Breathe slowly into your back.|catcow|Hips sink toward heels~Arms reach long~Neck relaxed|Holding your breath|1|
cobra|Cobra Stretch|Mobility|bw|cobra|2|8|15|Lie face down with your hands under your shoulders.;Press your chest up while keeping your hips on the floor.;Hold for a breath, then lower slowly.|Only go as high as feels comfortable for your back.|childs-pose|Hips stay on the floor~Shoulders down and back~Gentle, smooth lift|Shrugging your shoulders to your ears|1|
down-dog|Downward Dog|Mobility|bw|dd|2|8|15|Start in a high plank.;Push your hips up and back into an upside-down V.;Press your heels toward the floor, then return to plank.|Bend your knees to keep your back long.|catcow|Back long and flat~Push the floor away~Heels reach down|Rounding your back to get your heels down|1|
hip-flexor|Kneeling Hip-flexor Stretch|Mobility|bw|hipflex|2|30s|15|Kneel on one knee with the other foot flat in front.;Squeeze the glute of the back leg and shift your hips forward.;Hold, then switch sides.|Pad the back knee with a towel or cushion.|wgs|Torso tall~Back glute squeezed~Front knee over ankle|Arching your lower back instead of moving the hips|1|
ham-stretch|Seated Hamstring Stretch|Mobility|bw|hamstr|2|30s|15|Sit with your legs straight out in front.;Hinge forward from your hips with a long back.;Reach toward your toes and hold.|Bend your knees slightly if your back rounds.|goodmorning|Hinge from the hips~Back stays long~Relax and breathe|Rounding your back to reach further|1|
quad-stretch|Standing Quad Stretch|Mobility|bw|quad|2|30s|15|Stand tall, holding a wall for balance.;Bend one knee and hold your ankle behind you.;Pull your heel toward your glute, then switch sides.|Keep both knees close together.|hip-flexor|Knees side by side~Hips pushed slightly forward~Torso tall|Arching your back or letting the knee drift out|1|wall
t-spine|Thread the Needle|Mobility|bw|tspine|2|8|15|Start on your hands and knees.;Reach one arm up to the ceiling, following it with your eyes.;Sweep it under your body, then switch sides.|Let your upper back do the turning.|catcow|Hips stay over knees~Eyes follow the hand~Slow and smooth|Shifting your hips instead of rotating|1|
arm-circles|Arm Circles|Mobility|bw|circles|2|20|15|Stand tall with your arms out to the sides at shoulder height.;Make small circles forward with straight arms.;Switch direction halfway through.|Start small and let the circles grow.|catcow|Arms at shoulder height~Shoulders relaxed down~Smooth circles|Shrugging your shoulders|1|
superman|Superman|Back|bw|superman|3|12|30|Lie face down with your arms straight overhead.;Lift your arms, chest and legs a few centimetres off the floor.;Hold for a second, then lower slowly.|Look at the floor to keep your neck neutral.|bird-dog|Neck stays neutral~Squeeze your glutes~Lift and pause|Cranking your head back|1|
snow-angel|Reverse Snow Angel|Back|bw|angel|3|10|30|Lie face down with arms by your sides, palms down.;Lift your chest and arms slightly off the floor.;Sweep your arms overhead in a wide arc, then back to your hips.|Keep your arms hovering the whole time.|superman|Arms hover off the floor~Slow, wide arc~Shoulder blades squeezed|Letting your arms drop to the floor|2|
prone-y|Prone Y Raise|Back|bw|proney|3|12|30|Lie face down with arms overhead in a Y, thumbs up.;Lift your arms off the floor by squeezing your upper back.;Pause, then lower slowly.|Small lifts with a strong squeeze beat big ones.|superman|Thumbs point up~Shoulders away from your ears~Pause at the top|Shrugging toward your ears|1|
prone-t|Prone T Raise|Back|bw|pronet|3|12|30|Lie face down with arms straight out to the sides, thumbs up.;Squeeze your shoulder blades together to lift your arms.;Pause, then lower slowly.|Imagine pinching a pencil between your shoulder blades.|prone-y|Arms straight at shoulder height~Squeeze your shoulder blades~Slow lowering|Bending the elbows to cheat|1|
back-widow|Back Widow|Back|bw|widow|3|12|30|Lie on your back, knees bent, elbows bent at your sides.;Press your elbows into the floor to lift your upper back.;Hold for a second, then lower.|Drive through your elbows, not your neck.|superman|Elbows press down~Chest lifts up~Neck relaxed|Pushing up with your head|2|
pike-elev|Elevated Pike Push-up|Shoulders|bw|pikeel|3|8|75|Put your feet on a sturdy chair and walk your hands back until your hips are high.;Bend your elbows to lower your head toward the floor.;Press back up to straight arms.|The higher your hips, the harder it gets.|pike|Hips stacked over shoulders~Head between your hands~Elbows about 45°|Hips drifting back down|3|chair
plank-pike|Plank to Pike|Shoulders|bw|dd|3|10|45|Start in a high plank with hands under your shoulders.;Push your hips up into a pike, keeping your arms straight.;Lower back to plank with control.|Drive the movement with your shoulders and abs.|plank|Arms stay straight~Hips lift high~Back to a flat plank|Bending your elbows|2|
wall-hold|Wall Pike Hold|Shoulders|bw|wallhold|3|20s|60|Kneel facing away from a wall, hands on the floor, and walk your feet up the wall.;Walk your hands toward the wall until your body makes an L.;Push the floor away and hold.|Come down the same way you went up.|pike|Arms straight and locked~Shoulders over hands~Push the floor away|Sinking into your shoulders|2|wall
wall-tap|Wall Shoulder Tap|Shoulders|bw|walltap|3|10|60|Walk your feet up a wall into an L shape, hands under your shoulders.;Shift your weight and tap one shoulder with the opposite hand.;Replace it and switch sides.|Master the wall pike hold first.|wall-hold|Hands under shoulders~Hips stacked high~Slow taps|Letting the hips sag|3|wall
dive-bomber|Dive Bomber Push-up|Shoulders|bw|dive|3|8|60|Start in a pike with hips high.;Swoop your chest down between your hands and forward.;Push up into a cobra shape, then reverse back to the pike.|Move slowly to feel the full arc.|pike|Swoop low between your hands~Arms finish straight~Smooth reverse|Collapsing your hips at the bottom|3|
bw-split|Bodyweight Bulgarian Split Squat|Legs|bw|split|3|10|60|Stand in front of a chair and rest the top of your back foot on the seat.;Lower until your front thigh is parallel to the floor.;Drive through your front foot to stand.|Most of your weight stays on the front leg.|lunge-rev|Torso tall~Front knee over ankle~Back knee drops straight down|Front heel lifting|2|chair
bw-step-up|Step-up|Legs|bw|stepup|3|12|45|Stand facing a sturdy step or low box.;Step up with one foot and drive through it to stand tall.;Step down with control and repeat.|Push through the top foot, not the bottom one.|lunge-rev|Whole foot on the step~Stand fully tall~Control the step down|Pushing off the back foot|1|step
hang-knee|Hanging Knee Raise|Core|bar|hangknee|3|10|60|Hang from the bar with straight arms.;Bring your knees up toward your chest.;Lower slowly without swinging.|Curl your hips up, not just your knees.|rev-crunch|No swinging~Knees to hip height or higher~Slow lowering|Using momentum to swing up|2|
hang-leg|Hanging Leg Raise|Core|bar|hangleg|3|8|75|Hang from the bar with straight arms.;Keeping your legs straight, lift them to hip height.;Lower slowly to a still hang.|Master knee raises first.|leg-raise|Legs straight~Lift to hip height~No swinging|Swinging into each rep|3|
dead-hang|Dead Hang|Back|bar|hang|3|30s|60|Grip the bar with hands just wider than your shoulders.;Hang with straight arms and feet off the floor.;Breathe steadily and hold.|Great for grip strength and shoulder health.|towel-row|Arms straight~Relaxed, steady breathing~Feet off the floor|Holding your breath|1|
scap-pull|Scapular Pull-up|Back|bar|scap|3|10|60|Hang from the bar with straight arms.;Pull your shoulder blades down and back to lift your body slightly.;Lower to a full hang.|Your arms stay straight the whole time.|prone-y|Arms stay straight~Shoulders pull down from your ears~Small, controlled lift|Bending your elbows|1|
aus-row|Australian Row|Back|bar|ausrow|3|10|60|Set a bar at waist height and lie underneath it, gripping it.;With your body straight, pull your chest to the bar.;Lower slowly to straight arms.|Bend your knees to make it easier.|towel-row|Body in one straight line~Chest to the bar~Squeeze your shoulder blades|Hips sagging|2|
l-sit|Hanging L-sit|Core|bar|lsit|3|15s|75|Hang from the bar with straight arms.;Lift your straight legs until they are parallel to the floor.;Hold the L shape.|Tuck your knees if straight legs are too hard.|hollow|Legs parallel to the floor~Legs straight and together~Shoulders active|Letting the legs drop|3|
kb-clean|Kettlebell Clean|Shoulders|kb|clean|3|8|75|Hinge with the bell between your feet, one hand on the handle.;Drive your hips forward and pull the bell close up your body.;Let it roll onto your forearm in the rack at your shoulder.|Keep the bell close so it doesn’t bang your wrist.|kb-deadlift|Hips drive the bell~Bell stays close~Soft landing in the rack|Swinging the bell out wide|2|
kb-snatch|Kettlebell Snatch|Cardio|kb|snatch|3|6|90|Hinge and hike the bell back between your legs.;Drive your hips and pull the bell close as it rises.;Punch your hand through to lock out overhead.|Learn the swing and clean first.|swing|Hips power the lift~Punch through at the top~Lockout by your ear|Letting the bell flop onto your wrist|3|
kb-tgu|Turkish Get-up|Core|kb|tgu|2|3|90|Lie down holding the bell straight up over your shoulder.;Roll to your elbow, then your hand, and sweep into a half kneel.;Stand with the bell locked overhead, then reverse each step.|Keep your eyes on the bell the whole way.|deadbug|Arm locked straight~Eyes on the bell~One step at a time|Bending the arm holding the bell|3|
kb-halo|Kettlebell Halo|Shoulders|kb|halo|3|10|45|Hold the bell upside down by the horns at your chest.;Circle it around your head, keeping it close.;Switch direction each set.|Keep your ribs down and core tight.|arm-circles|Bell stays close to your head~Ribs down~Smooth circles|Arching your back|1|
kb-windmill|Kettlebell Windmill|Core|kb|windmill|3|6|60|Press the bell overhead and turn your feet slightly away from it.;Push your hips out and slide your free hand down your leg.;Return to standing with the arm locked.|Start light. This is about control.|side-plank|Overhead arm stays vertical~Eyes on the bell~Hips push out|Bending the overhead elbow|3|
kb-twist|Kettlebell Russian Twist|Core|kb|twist|3|16|45|Sit holding the bell at your chest, knees bent.;Lean back slightly with a straight back.;Rotate to bring the bell beside each hip.|Feet down makes it easier.|russian-twist|Chest tall~Rotate from the ribs~Bell stays close|Rounding your back|2|
kb-fig8|Kettlebell Figure-8|Core|kb|fig8|3|10|45|Stand with feet wide and bend into a half squat.;Pass the bell between your legs from one hand to the other.;Weave it around each leg in a figure-8.|Keep your back flat throughout.|bear-crawl|Back flat~Hips stay low~Smooth hand-offs|Rounding your back to chase the bell|2|
kb-curtsy|Kettlebell Curtsy Lunge|Legs|kb|curtsy|3|10|60|Hold the bell at your chest.;Step one leg back and across behind the other.;Lower until your front thigh is near parallel, then return.|Keep your hips facing forward.|lunge-rev|Hips face forward~Front knee over ankle~Torso tall|Letting the front knee cave in|2|
lat-raise|Lateral Raise|Shoulders|db|latraise|3|12|60|Stand with dumbbells at your sides, palms in.;Raise your arms out to the sides to shoulder height.;Lower slowly.|Lead with your elbows and keep a slight bend.|pike|Arms stop at shoulder height~Slight elbow bend~Slow lowering|Shrugging or swinging the weights|1|
front-raise|Front Raise|Shoulders|db|frontraise|3|12|60|Stand with dumbbells in front of your thighs.;Raise them straight forward to shoulder height.;Lower slowly.|Keep your torso still.|pike|Arms to shoulder height~Torso stays still~Slow lowering|Leaning back to swing the weights|1|
rear-fly|Rear Delt Fly|Back|db|rearfly|3|12|60|Hinge forward with a flat back, dumbbells hanging.;Raise your arms out to the sides, squeezing your shoulder blades.;Lower slowly.|Light weights and a slow squeeze work best.|prone-t|Back flat~Arms wide, slight bend~Squeeze at the top|Using momentum to fling the weights|2|
tri-ext|Overhead Triceps Extension|Arms|db|triext|3|12|60|Hold one dumbbell overhead with both hands.;Bend your elbows to lower it behind your head.;Straighten your arms to press it back up.|Keep your elbows pointing forward.|dip|Elbows point forward~Ribs down~Full lockout|Elbows flaring wide|1|
kickback|Triceps Kickback|Arms|db|kickback|3|12|45|Hinge forward with a flat back, elbows tucked at your sides.;Straighten your arm behind you, squeezing your triceps.;Lower back to 90° under control.|Only your forearm moves.|dip|Upper arm stays still~Full extension~Back flat|Swinging the upper arm|1|
step-up|Dumbbell Step-up|Legs|db|stepup|3|10|60|Stand facing a sturdy step or low box, dumbbells at your sides.;Step up with one foot and drive through it to stand tall.;Step down with control and repeat.|Push through the top foot, not the bottom one.|bw-step-up|Whole foot on the step~Stand fully tall~Control the step down|Pushing off the back foot|2|step
split-squat|Dumbbell Bulgarian Split Squat|Legs|db|split|3|8|75|Hold dumbbells at your sides and rest your back foot on a chair seat.;Lower until your front thigh is parallel to the floor.;Drive through your front foot to stand.|Most of your weight stays on the front leg.|bw-split|Torso tall~Front knee over ankle~Back knee drops straight down|Front heel lifting|3|chair
thruster|Dumbbell Thruster|Legs|db|thruster|3|10|75|Hold dumbbells at your shoulders.;Squat until your thighs are parallel.;Drive up and use that momentum to press the weights overhead.|One smooth motion from squat to press.|squat-jump|Thighs reach parallel~Drive from your legs~Full lockout overhead|Pressing before you stand up|2|
pullover|Dumbbell Pullover|Chest|db|pullover|3|12|60|Lie on your back holding one dumbbell over your chest with both hands.;Lower it in an arc behind your head with slightly bent arms.;Pull it back over your chest.|Only lower as far as your shoulders allow.|pushup|Ribs stay down~Slight elbow bend~Slow arc|Arching your back at the bottom|2|
db-fly|Dumbbell Floor Fly|Chest|db|fly|3|12|60|Lie on your back with dumbbells over your chest, palms facing.;Open your arms wide in an arc until your elbows touch the floor.;Squeeze your chest to bring them back together.|Keep a soft bend in your elbows.|wide-pushup|Soft elbows~Wide arc~Squeeze at the top|Bending the elbows into a press|1|
face-pull|Band Face Pull|Shoulders|band|facepull|3|15|45|Anchor the band at head height and hold one end in each hand.;Pull toward your face, splitting your hands apart beside your ears.;Return slowly.|Keep your elbows high and wide.|prone-t|Elbows high~Hands finish by your ears~Slow return|Shrugging your shoulders|1|
band-lat-raise|Banded Lateral Raise|Shoulders|band|latraise|3|15|45|Stand on the band and hold an end in each hand.;Raise your arms out to the sides to shoulder height.;Lower slowly.|Lead with your elbows.|pike|Arms stop at shoulder height~Slight elbow bend~Slow lowering|Shrugging or leaning|1|
pushdown|Band Triceps Pushdown|Arms|band|pushdown|3|15|45|Anchor the band high above you and grip it at chest height.;Push your hands down until your arms are straight.;Return slowly, keeping your elbows at your sides.|Keep your elbows pinned to your ribs.|dip|Elbows pinned~Full lockout~Slow return|Elbows drifting forward|1|
lateral-walk|Band Lateral Walk|Legs|band|latwalk|3|12|45|Place a loop band around your legs just above your knees.;Sink into a quarter squat.;Step sideways, keeping tension on the band, then bring the other foot in.|Point your toes forward the whole time.|bridge|Stay low~Knees push out~Controlled steps|Letting your knees cave in|1|
pull-through|Band Pull-through|Legs|band|pullthru|3|15|45|Anchor the band low behind you and hold it between your legs.;Hinge your hips back, letting the band pull your hands through.;Drive your hips forward to stand tall.|Your hips do the work, not your arms.|goodmorning|Back flat~Hips go back~Squeeze your glutes at the top|Pulling with your arms|1|
pallof|Pallof Press|Core|band|pallof|3|10|45|Anchor the band at chest height beside you and hold it at your chest.;Press your hands straight out in front.;Resist the twist, then bring them back.|Step further from the anchor to make it harder.|plank|Hips and shoulders square~Arms press straight~Slow return|Letting the band twist you|2|`.split("\n").forEach(l=>{const[id,name,m,eq,p,s,r,rs,st,tp,alt,ck,bad,lv,hh]=l.split("|");E[id]={id,name,m,eq,p,s:+s,r,rs:+rs,st:st.split(";"),tp,alt,ck:ck.split("~"),bad,lv:+lv,hh:hh||""}});
// levels + household items for the original exercises (id:level:item)
"squat-goblet:1,squat:1,db-lunge:2,lunge-rev:1,rdl:2,goodmorning:1,db-calf-raise:1,calf:1:wall,bridge:1,pushup:2,pushup-close:2,dip:1:chair,pike:2,press:1,row:1,towel-row:1:towel-door,pullup:3,band-apart:1,curl:1,towel-curl:1:towel,plank:1,deadbug:1,bicycle:2,climber:2,swing:2,squat-jump:2,burpee:3,catcow:1,wgs:1,hip90:1,kb-goblet:1,kb-deadlift:1,kb-row:1:chair,kb-press:2,kb-lunge:2,band-squat:1,band-row:1,band-press:1,band-curl:1,band-gm:1,band-bridge:1,chinup:2,wide-pullup:3,neg-pullup:2,db-sumo:1,db-rev-lunge:1,db-bent-row:2,db-hammer:1,db-arnold:2,db-bridge:1,sumo-squat:1,wide-pushup:2,diamond-pushup:3,sl-bridge:2,incline-pushup:1:table,decline-pushup:3:chair,knee-pushup:1,pause-pushup:2,clap-pushup:3,stagger-pushup:2,band-pushup:3,db-floor-press:1,db-squeeze-press:2,band-chest-press:1".split(",").forEach(x=>{const[i,l,h]=x.split(":");E[i].lv=+l;if(h)E[i].hh=h});
"band-squat:bsquat,band-row:brow".split(",").forEach(x=>{const[i,p]=x.split(":");E[i].p=p});
Object.values(E).forEach(e=>{e.lv=e.lv||1;e.hh=e.hh||""});
const HHS={chair:"Chair",table:"Table",towel:"Towel","towel-door":"Towel + door",wall:"Wall",step:"Step"},HHL={chair:"a sturdy chair",table:"a sturdy table or counter",towel:"a towel","towel-door":"a towel and a solid door",wall:"a wall",step:"a step or low box"};
// progressions, easiest to hardest
const CHAINS=[["incline-pushup","knee-pushup","pushup","decline-pushup","clap-pushup"],["squat","squat-jump","tuck-jump"],["bridge","sl-bridge"],["dead-hang","scap-pull","neg-pullup","pullup","wide-pullup"],["hang-knee","hang-leg","l-sit"],["plank","plank-tap"],["deadbug","hollow"],["crunch","rev-crunch","leg-raise","v-up"],["pike","pike-elev"],["wall-hold","wall-tap"],["kb-deadlift","swing","kb-snatch"],["superman","snow-angel"],["climber","burpee"],["lunge-rev","bw-split"],["bw-step-up","step-up"],["towel-row","aus-row"],["russian-twist","kb-twist"]];
// band drawing: [from,to] per segment; a point is a body key or a fixed [x,y] anchor
const BN={"band-apart":[["wL","wR"]],"band-squat":[["f","w"]],"band-press":[["f","w"]],"band-curl":[["f","w"]],"band-lat-raise":[["fL","wL"],["fR","wR"]],"band-gm":[["f","s"]],"band-bridge":[["loop","k"]],"band-row":[[[93,42],"w"]],"band-pushup":[["w","s"]],"band-chest-press":[[[14,38],"w"]],"face-pull":[[[93,20],"w"]],"pushdown":[[[70,-4],"w"]],"lateral-walk":[["kL","kR"]],"pull-through":[[[5,80],"w"]],"pallof":[[[93,38],"wR"]]};
const BASE=[["bw","🤸","Bodyweight","No kit needed"],["db","🏋️","Dumbbells","Fixed or adjustable"],["bar","🚪","Pull-up bar","Doorway or wall-mounted"],["band","🧶","Resistance band","Loop or tube"],["kb","🪣","Kettlebell","Single or pair"],["pb","💪","Push-up bars","Handles or stands"],["bag","🎒","Loaded backpack","Books or water bottles"]];
const MU=["All","Legs","Chest","Back","Shoulders","Arms","Core","Cardio","Mobility"];
const R=Math.PI/180,V=(a,b)=>[b[0]-a[0],b[1]-a[1]],ease=u=>(1-Math.cos(Math.PI*u))/2,CY=2.4,HD=.6,MV=1.8;
const un=v=>{const n=Math.hypot(v[0],v[1])||1;return[v[0]/n,v[1]/n]},an=(a,b,c)=>{const u=un(V(b,a)),v=un(V(b,c));return Math.acos(Math.max(-1,Math.min(1,u[0]*v[0]+u[1]*v[1])))/R};
// pose = hip h, torso angle t, ankle a (far ankle a2), wrist w; limbs solved with 2-bone IK so joints always stay anatomical
const pz=(h,t,a,w,x)=>({h,t,a,w,a2:a,b:0,hd:t,es:-1,...x});
const ln=(a,s,w,x)=>{const d=V(a,s),k=38/62;return pz([a[0]+d[0]*k,a[1]+d[1]*k],Math.atan2(d[1],d[0])/R,a,w,x)};
const mo=(P,lb,m,tg,x)=>{const q=[...P.keys()];return{P,lb,m:m||[],tg:tg||"",q:x&&x.loop?q:[...q,...q.slice(1,-1).reverse()],...x}};
const STAND=pz([50,49],-90,[50,87],[52,52]),SQB=pz([33,68],-60,[50,87],[66,40]),HB=pz([37,54],-25,[50,87],[58,68]),PL=ln([14,86],[72,66],[81,86]),PK=ln([14,84],[72,62],[72,86]);
// monitors: [joint,min°,max°]  k=knee h=hip e=elbow b=body line. Green when the angle is inside the target range.
const M={
inc:mo([ln([14,86],[72,43],[72,68]),ln([14,86],[74,53],[74,68])],["Press up","Lower chest"],[["e",65,180],["b",160,180]],"Body in one line, chest to the edge",{pr:'<rect x="63" y="69" width="31" height="20" rx="2" fill="#161616" stroke="#4a4a4a" stroke-width="1.3"/>'}),
dec:mo([ln([14,56],[72,62],[72,85]),ln([14,56],[74,72],[74,85])],["Press up","Lower chest"],[["e",65,180],["b",160,180]],"Body in one line, head between hands",{pr:'<rect x="3" y="59" width="24" height="30" rx="2" fill="#161616" stroke="#4a4a4a" stroke-width="1.3"/>'}),
kpush:mo([ln([28,85],[74,60],[74,85]),ln([28,85],[76,70],[76,85])],["Press up","Lower chest"],[["e",65,180],["b",160,180]],"Straight line from knees to head"),
fpress:mo([pz([46,84],180,[66,86],[18,56]),pz([46,84],180,[66,86],[18,74])],["Press up","Lower to floor"],[["e",60,180]],"Elbows about 45° from your body"),
bpress:mo([pz([50,49],-90,[50,87],[74,38]),pz([50,49],-90,[50,87],[56,38])],["Press forward","Return slowly"],[["e",60,180]],"Full reach at chest height"),
squat:mo([pz([50,49],-90,[50,87],[68,34]),SQB],["Sit back & down","Stand tall"],[["k",70,100]],"Thighs parallel"),
sj:mo([SQB,pz([50,45],-90,[50,81],[52,2])],["Explode up","Land softly"]),
lunge:mo([STAND,pz([47,69],-88,[64,87],[52,52],{a2:[27,84]})],["Step & lower","Push back up"],[["k",75,100]],"90° front knee"),
wgs:mo([pz([36,70],-10,[64,87],[62,86],{a2:[14,84]}),pz([38,69],-55,[64,87],[50,26],{a2:[14,84]})],["Rotate & reach","Return"]),
hinge:mo([STAND,HB],["Hips back","Hips forward"],[["h",70,115]],"Hips back, flat back"),
gm:mo([pz([50,49],-90,[50,87],[48,14]),pz([37,54],-25,[50,87],[62,36])],["Hips back","Squeeze up"],[["h",70,115]],"Hips back, flat back"),
swing:mo([HB,pz([50,49],-90,[50,87],[70,28])],["Snap hips","Hike back"]),
calf:mo([STAND,pz([50,44],-90,[50,82],[52,48])],["Rise","Lower slowly"]),
bridge:mo([pz([46,84],180,[66,86],[34,85]),pz([46,64],136,[66,86],[34,85])],["Lift hips","Lower"],[["h",120,180]],"Hips lifted"),
push:mo([ln([16,83],[74,60],[74,85]),ln([16,83],[76,70],[76,85])],["Lower chest","Press up"],[["e",65,100],["b",165,180]],"Chest low, elbows ~90°"),
pike:mo([pz([42,50],48,[24,85],[70,86]),pz([48,58],25,[24,85],[70,86])],["Head down","Press up"],[["e",80,110]],"Elbows ~90°"),
dip:mo([pz([36,52],-90,[54,86],[34,52]),pz([36,59],-90,[54,86],[34,52])],["Lower","Press up"],[["e",75,100]],"Elbows ~90°",{pr:'<rect x="12" y="53" width="24" height="4" rx="1.5" fill="#444" stroke="none"/><path d="M16 57V88M33 57V88" stroke="#444" stroke-width="2"/>'}),
row:mo([HB,pz([37,54],-25,[50,87],[48,44])],["Pull elbow up","Lower slowly"],[["e",45,100]],"Elbow past back"),
inrow:mo([ln([60,87],[40,29],[62,38]),ln([60,87],[54,27],[66,40])],["Pull chest in","Lower slowly"],[["e",70,110]],"Chest to door",{pr:'<path d="M77 -8V89" stroke="#444" stroke-width="3"/><path d="M62 38L77 41" stroke="#8c8c8c" stroke-width="1.8"/>'}),
band:mo([pz([50,49],-90,[50,87],[73,26]),pz([50,49],-90,[50,87],[62,26])],["Pull apart","Return slowly"]),
curl:mo([STAND,pz([50,49],-90,[50,87],[58,28])],["Curl up","Lower slowly"],[["e",30,60]],"Full curl, elbow pinned"),
tcurl:mo([pz([50,49],-90,[50,87],[62,36]),pz([50,49],-90,[50,87],[62,36])],["Pull hard","Hold"],[["e",70,100]],"90° elbows",{g:0}),
press:mo([pz([50,49],-90,[50,87],[57,27]),pz([50,49],-90,[50,87],[52,1])],["Press up","Lower"],[["e",165,180]],"Full lockout"),
pull:mo([pz([50,52],-90,[44,84],[52,3.5],{es:1}),pz([50,33],-90,[46,70],[52,3.5],{es:1})],["Pull up","Lower fully"],[["e",15,70]],"Chin over bar",{pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
plank:mo([PL,PL],["Hold steady","Hold steady"],[["b",168,180]],"Straight line",{g:0}),
deadbug:mo([pz([50,84],180,[69,65],[26,60]),pz([50,84],180,[69,65],[4,82],{a2:[88,80]})],["Extend","Return"]),
bicycle:mo([pz([50,83],206,[68,68],[26,62],{a2:[86,80]}),pz([50,83],206,[86,80],[26,62],{a2:[68,68]})],["Twist","Switch"],[],"",{g:0}),
climb:mo([ln([14,84],[72,62],[72,86],{a2:[50,74]}),ln([14,84],[72,62],[72,86],{a:[50,74],a2:[14,84]})],["Drive knee","Switch"],[],"",{g:0}),
burpee:mo([pz([50,49],-90,[50,87],[52,3]),pz([36,70],-20,[48,87],[62,86]),PK],["Down to plank","Jump back in"]),
cat:mo([pz([30,60],0,[11,86],[54,84],{b:-7,hd:40}),pz([30,60],0,[11,86],[54,84],{b:7,hd:-40})],["Cow: arch & look up","Cat: round & tuck chin"]),
hip90:mo([pz([46,82],-90,[64,86],[40,84],{a2:[56,86]}),pz([46,82],-90,[56,86],[40,84],{a2:[66,86]})],["Rotate","Rotate back"])};
// ===== front-facing view: pelvis h, torso angle t, ankles aL/aR, wrists wL/wR. lf/af/tl shorten legs/arms/torso for foreshortening, eh = hand(s) holding the weight
const fz=(h,t,aL,aR,wL,wR,x)=>({fv:1,h,t,aL,aR,wL,wR,hd:t,lf:1,af:1,tl:1,hs:1,eh:"B",nl:0,...x});
const mir=p=>[100-p[0],p[1]];
// reusable surface props
const PR={
box:(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#161616" stroke="#4a4a4a" stroke-width="1.3"/>`,
chair:(x,y)=>`<rect x="${x}" y="${y}" width="24" height="4" rx="1.5" fill="#444" stroke="none"/><path d="M${x+4} ${y+4}V88M${x+21} ${y+4}V88" stroke="#444" stroke-width="2"/><path d="M${x+2} ${y}V${y-18}" stroke="#444" stroke-width="2"/>`,
wall:x=>`<path d="M${x} -5V89" stroke="#444" stroke-width="3"/>`,
lowbar:(x1,x2,y)=>`<path d="M${x1} ${y}H${x2}" stroke="#8c8c8c" stroke-width="3"/><path d="M${x1} ${y}V89M${x2} ${y}V89" stroke="#444" stroke-width="2"/>`,
mat:'<rect x="27" y="-3" width="46" height="92" rx="5" fill="#111" stroke="#2b2b2b" stroke-width="1.2"/>'};
const QP=pz([40,66],-9.5,[21,86],[64,86],{hd:-9.5}),PLK=ln([14,86],[72,62],[74,86]),PIK=pz([37.5,56],38.6,[14,86],[74,86],{hd:65}),HANG=pz([50,52],-90,[44,84],[52,3.5],{es:1});
Object.assign(M,{
band:mo([fz([50,49],-90,[46,87],[54,87],[47,27],[53,27],{af:.45}),fz([50,49],-90,[46,87],[54,87],[19,27],[81,27])],["Pull apart","Return slowly"]),
bsquat:mo([pz([50,49],-90,[50,87],[57,27]),pz([33,68],-60,[50,87],[51,43])],["Sit back & down","Stand tall"],[["k",70,100]],"Thighs parallel"),
brow:mo([pz([50,50],-84,[54,87],[73,40],{a2:[46,87]}),pz([50,50],-84,[54,87],[50,44],{a2:[46,87]})],["Pull to ribs","Return slowly"],[["e",40,100]],"Elbow past your back"),
crunch:mo([pz([50,84],180,[68,86],[20,80],{hd:180}),pz([50,84],210,[68,86],[22,66],{hd:205})],["Curl up","Lower slowly"]),
revcrunch:mo([pz([50,84],180,[69,65],[44,86]),pz([50,80],186,[56,60],[44,86])],["Curl hips","Lower slowly"]),
legraise:mo([pz([50,84],180,[87,85],[46,86]),pz([50,84],180,[51,46],[46,86])],["Lift legs","Lower slowly"],[["h",75,110]],"Legs vertical"),
flutter:mo([pz([50,84],180,[87,77],[46,86],{a2:[88,83]}),pz([50,84],180,[88,83],[46,86],{a2:[87,77]})],["Kick","Kick"],[],"",{g:0}),
hollow:mo([pz([50,82],195,[86,76],[4,73],{hd:195}),pz([50,82],191,[87,79],[3,76],{hd:191})],["Hold","Hold"],[],"",{g:0}),
sideplank:mo([fz([46,73],-40,[14,82],[12,86],[59,26],[70,86],{hd:-40}),fz([44,66],-25,[14,82],[12,86],[62,25],[70,86],{hd:-25})],["Lift hips","Lower"],[["b",165,180]],"Straight line"),
birddog:mo([QP,pz([40,66],-9.5,[21,86],[88,58],{a2:[4,60],hd:-9.5})],["Reach arm & leg","Return"]),
twist:mo([pz([40,82],-125,[66,70],[44,60],{hd:-110}),pz([40,82],-118,[66,70],[34,84],{hd:-100})],["Rotate & tap","Back to center"]),
planktap:mo([PLK,ln([14,86],[72,62],[66,58])],["Tap shoulder","Hand down"],[["b",165,180]],"Hips level"),
vup:mo([pz([50,84],180,[88,85],[4,84],{hd:180}),pz([50,84],228,[70,56],[64,52],{hd:228})],["Reach up","Lower slowly"]),
jack:mo([fz([50,49],-90,[46,87],[54,87],[41,49],[59,49]),fz([50,46],-90,[33,85],[67,85],[37,-1],[63,-1])],["Jump out","Jump in"]),
highknee:mo([pz([50,49],-90,[62,68],[62,30],{a2:[50,87]}),pz([50,49],-90,[50,87],[40,46],{a2:[62,68]})],["Drive knee","Switch"],[],"",{g:0}),
buttkick:mo([pz([50,49],-90,[39,55],[60,34],{a2:[50,87]}),pz([50,49],-90,[50,87],[42,46],{a2:[39,55]})],["Kick","Switch"],[],"",{g:0}),
skater:mo([fz([36,55],-78,[32,87],[46,80],[60,52],[66,44]),fz([64,55],-102,[54,80],[68,87],[34,44],[40,52])],["Leap","Leap back"],[],"",{g:0}),
tuck:mo([pz([45,60],-76,[52,87],[60,52]),pz([50,37],-86,[60,51],[64,33])],["Jump & tuck","Land softly"]),
bear:mo([pz([40,64],-5,[22,86],[70,86],{a2:[28,86],hd:10}),pz([44,64],-5,[30,86],[64,86],{a2:[22,86],hd:10})],["Step","Step"],[],"",{g:0}),
box:mo([pz([48,49],-86,[60,87],[56,18],{a2:[38,87]}),pz([49,49],-84,[60,87],[74,22],{a2:[38,87]})],["Punch","Guard"],[],"",{g:0}),
inchworm:mo([pz([22,49],-90,[22,87],[24,73]),pz([22,50],62,[22,87],[38,86],{hd:72}),ln([22,86],[80,64],[82,86])],["Walk out","Walk back"]),
child:mo([QP,pz([28,74],16,[12,86],[74,86],{hd:22})],["Sit back","Return"]),
cobra:mo([pz([46,83],-4,[10,85],[66,86],{hd:-4}),pz([46,83],-32,[10,85],[66,86],{hd:-50})],["Press chest up","Lower"]),
dd:mo([PLK,PIK],["Hips up & back","Back to plank"],[["e",160,180]],"Arms straight"),
hipflex:mo([pz([46,66],-90,[64,87],[56,58],{a2:[22,86]}),pz([52,68],-88,[64,87],[60,60],{a2:[22,86]})],["Shift hips forward","Ease back"]),
hamstr:mo([pz([30,84],-80,[66,86],[40,66],{hd:-80}),pz([30,84],-28,[66,86],[66,82],{hd:-15})],["Hinge forward","Sit tall"]),
quad:mo([pz([50,49],-90,[50,87],[52,52],{a2:[50,87]}),pz([50,49],-90,[43,50],[44,48],{a2:[50,87]})],["Pull heel up","Release"]),
tspine:mo([pz([40,66],-9.5,[21,86],[46,82],{hd:60}),QP,pz([40,66],-9.5,[21,86],[64,38],{hd:-70})],["Reach up","Thread under"]),
circles:mo([fz([50,49],-90,[46,87],[54,87],[18,23],[82,23]),fz([50,49],-90,[46,87],[54,87],[20,25],[80,25]),fz([50,49],-90,[46,87],[54,87],[18,27],[82,27]),fz([50,49],-90,[46,87],[54,87],[16,25],[84,25])],["Circle","Circle"],[],"",{loop:1,g:0}),
superman:mo([pz([44,83],0,[8,84],[92,83],{hd:0}),pz([44,83],-10,[8,77],[90,72],{hd:-12})],["Lift","Lower slowly"]),
angel:mo([fz([50,50],-90,[46,88],[54,88],[36,57],[64,57]),fz([50,50],-90,[46,88],[54,88],[18,26],[82,26]),fz([50,50],-90,[46,88],[54,88],[37,-1],[63,-1])],["Sweep overhead","Sweep back"],[],"",{pr:PR.mat,nf:1}),
proney:mo([pz([44,83],-4,[8,84],[92,82],{hd:-4}),pz([44,83],-8,[8,84],[90,70],{hd:-8})],["Lift arms","Lower slowly"]),
pronet:mo([fz([50,86],-90,[46,88],[54,88],[18,85],[82,85],{tl:.22,nl:1,hs:.75}),fz([50,86],-90,[46,88],[54,88],[20,73],[80,73],{tl:.22,nl:1,hs:.75})],["Lift arms","Lower slowly"]),
widow:mo([pz([52,83],180,[70,86],[24,72],{hd:180,es:1}),pz([52,83],197,[70,86],[26,64],{hd:197,es:1})],["Press elbows down","Lower"]),
pikeel:mo([pz([52,44],57,[18,54],[72,86],{hd:70}),pz([50,52],80,[18,54],[72,86],{hd:85})],["Lower head","Press up"],[],"",{pr:PR.box(4,58,26,31)}),
wallhold:mo([pz([56,38],90,[90,38],[56,86],{hd:76}),pz([56,38],90,[90,38],[56,86],{hd:76})],["Hold","Hold"],[["e",165,180]],"Arms locked",{g:0,pr:PR.wall(97)}),
walltap:mo([pz([56,38],90,[90,38],[56,86],{hd:76}),pz([56,38],90,[90,38],[52,66],{hd:76})],["Tap","Hand down"],[],"",{pr:PR.wall(97)}),
dive:mo([PIK,pz([40,76],8,[14,86],[74,86],{hd:5}),pz([42,82],-30,[14,86],[74,86],{hd:-40})],["Swoop through","Push back"]),
split:mo([pz([50,46],-88,[67,87],[52,70],{a2:[22,56]}),pz([47,62],-86,[67,87],[50,85],{a2:[22,56]})],["Lower","Drive up"],[["k",75,105]],"Front thigh parallel",{pr:PR.chair(9,60)}),
stepup:mo([pz([44,50],-88,[64,70],[46,74],{a2:[42,87]}),pz([62,37],-90,[64,70],[63,61],{a2:[57,70]})],["Step up","Step down"],[],"",{pr:PR.box(56,74,32,15)}),
hangknee:mo([HANG,pz([50,52],-90,[66,64],[52,3.5],{es:1})],["Knees up","Lower slowly"],[],"",{pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
hangleg:mo([HANG,pz([50,52],-90,[87,54],[52,3.5],{es:1})],["Legs up","Lower slowly"],[["h",75,110]],"Legs at hip height",{pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
hang:mo([HANG,pz([50,53],-90,[45,85],[52,3.5],{es:1})],["Hang","Hang"],[],"",{g:0,pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
scap:mo([pz([50,54],-90,[45,86],[52,3.5],{es:1}),pz([50,50],-90,[45,82],[52,3.5],{es:1})],["Shoulders down","Relax"],[],"",{pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
lsit:mo([pz([50,52],-90,[87,54],[52,3.5],{es:1}),pz([50,52],-90,[87,55],[52,3.5],{es:1})],["Hold","Hold"],[["h",75,110]],"Legs at hip height",{g:0,pr:'<path d="M30 3.5H70" stroke="#8c8c8c" stroke-width="3"/>'}),
ausrow:mo([ln([10,86],[68,70],[70,48]),ln([10,86],[66,56],[70,48])],["Pull chest up","Lower slowly"],[["b",160,180]],"Body in one line",{pr:PR.lowbar(56,84,48)}),
clean:mo([pz([37,54],-25,[50,87],[56,72]),pz([50,49],-90,[50,87],[57,30])],["Drive & rack","Lower"]),
snatch:mo([pz([37,54],-25,[50,87],[52,74]),pz([50,49],-90,[50,87],[52,1])],["Drive & punch up","Lower"],[["e",160,180]],"Full lockout"),
tgu:mo([pz([46,84],180,[64,86],[22,60]),pz([46,84],235,[66,86],[32,40],{hd:235}),pz([46,64],-90,[62,87],[46,16],{a2:[28,86]}),pz([50,49],-90,[50,87],[50,1])],["Rise up","Reverse down"],[["e",160,180]],"Arm locked"),
halo:mo([fz([50,49],-90,[45,87],[55,87],[49,32],[51,32],{eh:"R"}),fz([50,49],-90,[45,87],[55,87],[35,14],[37,14],{eh:"R"}),fz([50,49],-90,[45,87],[55,87],[49,1],[51,1],{eh:"R"}),fz([50,49],-90,[45,87],[55,87],[63,14],[65,14],{eh:"R"})],["Circle","Circle"],[],"",{loop:1,g:0}),
windmill:mo([fz([50,49],-90,[40,87],[60,87],[43,49],[58,1],{eh:"R"}),fz([56,52],-140,[40,87],[60,87],[37,66],[43,6],{eh:"R"})],["Hips out, reach down","Stand tall"]),
fig8:mo([fz([50,58],-88,[33,87],[67,87],[31,72],[47,74],{eh:"L"}),fz([50,58],-88,[33,87],[67,87],[50,77],[50,77],{eh:"R"}),fz([50,58],-88,[33,87],[67,87],[53,74],[69,72],{eh:"R"}),fz([50,58],-88,[33,87],[67,87],[50,77],[50,77],{eh:"L"})],["Weave","Weave"],[],"",{loop:1,g:0}),
curtsy:mo([fz([50,49],-90,[45,87],[55,87],[49,33],[51,33],{eh:"R"}),fz([47,62],-90,[44,87],[37,83],[46,46],[48,46],{eh:"R"})],["Step back & across","Return"]),
latraise:mo([fz([50,49],-90,[46,87],[54,87],[40,49],[60,49]),fz([50,49],-90,[46,87],[54,87],[19,28],[81,28])],["Raise","Lower slowly"],[["a",75,105]],"Arms at shoulder height"),
frontraise:mo([pz([50,49],-90,[50,87],[53,49]),pz([50,49],-90,[50,87],[74,27])],["Raise","Lower slowly"],[["a",75,105]],"Arm at shoulder height"),
rearfly:mo([fz([50,50],-90,[45,87],[55,87],[42,60],[58,60],{tl:.55,hs:.8}),fz([50,50],-90,[45,87],[55,87],[19,40],[81,40],{tl:.55,hs:.8})],["Raise wide","Lower slowly"]),
triext:mo([pz([50,49],-90,[50,87],[44,17],{es:1}),pz([50,49],-90,[50,87],[51,1],{es:1})],["Press up","Lower behind head"],[["e",160,180]],"Full lockout"),
kickback:mo([pz([37,54],-25,[50,87],[48,64]),pz([37,54],-25,[50,87],[35,54])],["Extend back","Lower"],[["e",160,180]],"Arm straight"),
thruster:mo([pz([33,68],-60,[50,87],[51,43]),pz([50,49],-90,[50,87],[52,1])],["Drive & press","Lower to squat"],[["e",160,180]],"Full lockout"),
pullover:mo([pz([56,84],180,[74,86],[33,60],{hd:180}),pz([56,84],180,[74,86],[16,66],{hd:180}),pz([56,84],180,[74,86],[8,80],{hd:180})],["Lower behind head","Pull over chest"]),
fly:mo([fz([50,50],-90,[46,88],[54,88],[46,36],[54,36],{af:.5}),fz([50,50],-90,[46,88],[54,88],[19,31],[81,31])],["Open wide","Squeeze together"],[],"",{pr:PR.mat,nf:1}),
facepull:mo([pz([50,49],-90,[52,87],[74,22]),pz([50,49],-90,[52,87],[57,15],{es:1})],["Pull to face","Return slowly"]),
pushdown:mo([pz([50,49],-90,[50,87],[60,38]),pz([50,49],-90,[50,87],[53,49])],["Push down","Return slowly"],[["e",160,180]],"Full lockout"),
latwalk:mo([fz([50,55],-90,[40,87],[60,87],[44,57],[56,57]),fz([46,55],-90,[30,87],[58,87],[40,57],[52,57])],["Step out","Step in"]),
pullthru:mo([pz([40,54],-30,[52,87],[52,66]),pz([50,49],-90,[50,87],[56,58])],["Drive hips forward","Hinge back"],[["h",160,185]],"Stand fully tall"),
pallof:mo([fz([50,49],-90,[44,87],[56,87],[47,37],[53,37]),fz([50,49],-90,[44,87],[56,87],[49,39],[51,39],{af:.42})],["Press out","Bring in"],[],"",{pr:'<path d="M93 89V36" stroke="#444" stroke-width="2.5"/>'})});
// ===== v2 additions: warm-up, cool-down and hostel-friendly exercises =====
// id|name|muscle|equipment|motion|sets|reps|rest|steps;|tip|fallback|form checks~|common mistake|level|household item
`march|March in Place|Cardio|bw|march|1|45s|5|Stand tall with your feet hip-width apart.;Lift one knee at a time to about hip height, swinging the opposite arm.;Keep a steady, easy rhythm.|Easy pace: you should be able to talk.|high-knees|Chest tall~Soft, quiet landings~Swing your arms|Leaning back as you lift your knees|1|
leg-swing|Leg Swings|Mobility|bw|lswing|2|10|3|Stand beside a wall and rest one hand on it.;Swing the outside leg forward and back like a pendulum, keeping it fairly straight.;Do all reps, then switch legs.|Start small and let the swing grow.|hip90|Stand tall, don’t lean~Swing from the hip~Controlled, not wild|Leaning your torso to swing higher|1|wall
lat-lunge|Lateral Lunge|Legs|bw|latlunge|2|6|3|Stand with your feet together and chest tall.;Step wide to the side and sit back into that hip, keeping the other leg straight.;Push off the bent leg to return, then repeat on the other side.|Keep your toes pointing forward.|lunge-rev|Sit back into the hip~Chest tall~Toes point forward|Letting the bent knee cave inward|1|
scap-pushup|Scapular Push-up|Chest|bw|scappush|1|10|6|Start in a high plank with your arms straight.;Let your chest sink between your shoulder blades without bending your elbows.;Push the floor away to spread your shoulder blades wide.|Only your shoulder blades move.|plank|Arms stay straight~Shoulder blades squeeze, then spread~Body stays in one line|Bending your elbows|1|
wall-slide|Wall Slide|Shoulders|bw|wslide|1|10|6|Stand with your back and forearms against a wall, elbows bent at 90°.;Slide your arms up the wall until they reach overhead without arching your back.;Slide back down.|Keep your ribs down and your head against the wall.|arm-circles|Back stays on the wall~Forearms stay in contact~Ribs down|Arching your lower back|1|wall
wrist-circle|Wrist Circles|Mobility|bw|wrist|1|10|6|Hold your arms out in front of you with your fists relaxed.;Circle both wrists slowly in one direction.;Switch direction halfway.|Prepares your wrists for push-ups and presses.|arm-circles|Slow, full circles~Arms relaxed~Switch direction halfway|Rushing through them|1|
arm-swing|Arm Swings|Mobility|bw|aswing|1|20|6|Stand tall with your arms stretched out wide.;Swing both arms across your chest, then open them wide again.;Alternate which arm is on top.|Keep your chest tall and breathe.|arm-circles|Chest stays tall~Swing from the shoulders~Easy rhythm|Hunching forward|1|
chest-stretch|Doorway Chest Stretch|Mobility|bw|chestst|2|30s|3|Stand beside a wall or doorframe and place your forearm on it with your elbow at shoulder height.;Step forward gently and turn your body away until you feel a stretch across your chest.;Hold, then switch sides.|Stop at a stretch, never at pain.|cobra|Elbow at shoulder height~Chest open~Shoulders relaxed|Shrugging or arching your back|1|wall
xbody-stretch|Cross-body Shoulder Stretch|Mobility|bw|xbody|2|30s|3|Bring one arm straight across your chest.;Hold it just above the elbow with your other hand and pull it gently closer.;Hold, then switch arms.|Keep your shoulder down, away from your ear.|arm-circles|Shoulder stays down~Arm stays straight~Breathe slowly|Shrugging your shoulder up|1|
tri-stretch|Overhead Triceps Stretch|Mobility|bw|tristr|2|30s|3|Raise one arm and bend the elbow so your hand reaches down your back.;Use your other hand to press the elbow gently back.;Hold, then switch arms.|Keep your ribs down and your neck relaxed.|xbody-stretch|Elbow points to the ceiling~Ribs down~Neck relaxed|Arching your lower back|1|
spinal-twist|Lying Spinal Twist|Mobility|bw|spintw|2|30s|3|Lie on your back with your knees bent and arms out to the sides.;Let both knees fall to one side while your shoulders stay on the floor.;Hold, then switch sides.|Breathe out as you sink into the twist.|childs-pose|Shoulders stay down~Knees stay together~Slow breaths|Forcing the knees to the floor|1|
fig4|Figure-4 Glute Stretch|Mobility|bw|fig4|2|30s|3|Lie on your back with your knees bent.;Cross one ankle over the opposite knee.;Pull the bottom thigh toward your chest until you feel the stretch in your glute. Hold, then switch.|Keep the top foot flexed to protect your knee.|ham-stretch|Top foot flexed~Head and shoulders relaxed~Pull gently|Pulling hard on the knee|1|
calf-stretch|Wall Calf Stretch|Mobility|bw|calfst|2|30s|3|Stand facing a wall with your hands on it and one foot back.;Keep the back leg straight with the heel down, and bend the front knee.;Lean in until you feel the stretch in your calf. Hold, then switch.|Keep your back heel flat.|quad-stretch|Back heel stays down~Back leg straight~Toes point forward|Letting the back heel lift|1|wall
side-bend|Standing Side Bend|Mobility|bw|sidebend|2|20s|3|Stand tall with your feet hip-width apart and one arm overhead.;Reach up and over to the side, lengthening your whole side body.;Hold, then switch sides.|Bend sideways, not forward.|overhead-reach|Hips stay still~Reach up first, then over~Breathe slowly|Leaning forward or twisting|1|
overhead-reach|Overhead Reach & Breathe|Mobility|bw|oreach|1|30s|3|Stand tall and interlace your fingers.;Reach your arms overhead and take slow, deep breaths.;Let your heart rate settle.|A calm finish tells your body the session is over.|childs-pose|Ribs down~Slow breaths~Shoulders relaxed|Holding your breath|1|
donkey|Donkey Kick|Legs|bw|donkey|3|12|45|Start on your hands and knees with a flat back.;Keeping your knee bent, press one heel up toward the ceiling.;Squeeze your glute at the top, lower, and finish all reps before switching legs.|Don’t swing: squeeze at the top.|bridge|Back stays flat~Hips stay level~Squeeze at the top|Arching your lower back to lift higher|1|
wall-sit|Wall Sit|Legs|bw|wallsit|3|30s|45|Lean your back against a wall and slide down until your thighs are parallel to the floor.;Keep your knees over your ankles and your back flat on the wall.;Hold the position.|Press your lower back into the wall.|squat|Thighs parallel~Knees over ankles~Back flat on the wall|Sliding up out of position|1|wall
bag-squat|Backpack Goblet Squat|Legs|bag|squat|3|12|60|Hug a loaded backpack against your chest.;Sit your hips back and down until your thighs are parallel.;Drive through your whole foot to stand tall.|Fill it with books or water bottles and zip it up.|squat|Chest tall~Knees over toes~Heels stay flat|Letting your knees cave in|1|
bag-rdl|Backpack Romanian Deadlift|Legs|bag|hinge|3|12|60|Hold a loaded backpack by its top handle in front of your thighs.;Push your hips back, sliding the bag down your legs with a flat back.;Lower to mid-shin, then drive your hips forward to stand.|Feel it in your hamstrings, not your lower back.|goodmorning|Back stays flat~Bag slides along your legs~Hips go back, not down|Rounding your back|1|
bag-row|Backpack Bent-over Row|Back|bag|row|3|12|60|Hold the backpack by its handle and hinge forward with a flat back.;Pull it toward your ribs, squeezing your shoulder blade.;Lower slowly.|Swap hands halfway through each set to stay even.|towel-row|Back flat, neck neutral~Elbow brushes your ribs~Squeeze the shoulder blade|Twisting your torso to lift|1|
bag-press|Backpack Floor Press|Chest|bag|fpress|3|12|60|Lie on your back with your knees bent, holding the backpack against your chest.;Press it straight up until your arms are straight.;Lower until your elbows lightly touch the floor.|Zip the bag and hold it by the sides.|pushup|Elbows about 45° from your body~Press in a straight line~Full lockout|Flaring your elbows out to 90°|1|
bag-lunge|Backpack Reverse Lunge|Legs|bag|lunge|3|10|60|Hug the backpack to your chest.;Step one foot back and lower both knees to about 90°.;Push through the front heel to stand, then alternate legs.|Keep the bag close and your torso tall.|lunge-rev|Torso tall~Front knee over ankle~Push through the front heel|Leaning forward or a short step back|1|
bag-bridge|Backpack Glute Bridge|Legs|bag|bridge|3|12|45|Lie on your back with your knees bent and the backpack resting across your hips.;Drive your hips up until your body is a straight line.;Squeeze your glutes, then lower.|Hold the bag steady with both hands.|bridge|Ribs down, no back arch~Squeeze glutes at the top~Push the floor away with your heels|Arching your lower back|1|
table-tri-ext|Table Triceps Extension|Arms|bw|tabext|3|10|60|Stand facing a sturdy table or desk and place your hands on its edge, shoulder-width apart, body in a straight line.;Bend your elbows and lower your forehead toward the table, keeping your upper arms still.;Straighten your arms to push back up.|Use a table that cannot slide: push it against a wall first.|pushup-close|Body in one straight line~Elbows point forward~Only your forearms move|Letting your hips sag or elbows flare|1|table
bar-pushup|Push-up on Bars|Chest|pb|pbpush|3|12|60|Grip the push-up bars with your hands under your shoulders and your body in a straight line.;Lower your chest until it is level with your hands, elbows about 45° from your body.;Press back up until your arms are straight.|The bars let you go deeper than the floor, and your wrists stay straight.|pushup|Body is one straight line~Chest drops to hand level~Elbows about 45° from your torso|Sagging hips or flaring your elbows out wide|1|
bar-wide-pushup|Wide Push-up on Bars|Chest|pb|pbpush|3|10|60|Set the bars wider than your shoulders and grip them with your body in a straight line.;Lower your chest between the bars until it is level with your hands.;Press back up without letting your hips sag.|Wider bars shift more of the work onto your chest.|wide-pushup|Bars wider than your shoulders~Body is one straight line~Chest drops to hand level|Letting your shoulders roll forward at the bottom|2|
bar-pause-pushup|Pause Push-up on Bars|Chest|pb|pbpush|3|8|75|Grip the bars with your body in a straight line.;Lower slowly until your chest is level with your hands and hold for 2 seconds.;Press up powerfully.|The pause takes away momentum, so every rep counts.|pause-pushup|Hold 2 seconds at the bottom~Core stays tight~Press up without bouncing|Bouncing out of the bottom|2|
bar-decline-pushup|Decline Push-up on Bars|Chest|pb|pbdec|3|8|75|Put your feet on a sturdy chair and grip the bars under your shoulders.;Lower your chest between the bars until it is level with your hands.;Press back up, keeping your body in one line.|Raising your feet moves the work to your upper chest and shoulders.|decline-pushup|Feet stay planted on the chair~Body is one straight line~Chest drops to hand level|Letting your hips sag or pike up|3|chair
bar-close-pushup|Close-grip Push-up on Bars|Arms|pb|pbpush|3|10|60|Set the bars about shoulder-width apart, or a little closer.;Lower with your elbows tucked against your ribs until your chest is level with your hands.;Press up hard through your triceps.|Close hands and tight elbows move the work to your triceps.|pushup-close|Elbows brush your ribs~Body stays straight~Press through your triceps|Elbows flaring out wide|2|
bar-pike|Pike Push-up on Bars|Shoulders|pb|pbpike|3|8|75|Grip the bars and walk your feet in until your hips are high, like an upside-down V.;Bend your elbows to lower your head between the bars.;Press back up to straight arms.|The bars give your head extra room to go deeper.|pike|Hips stay high~Head goes between your hands~Elbows bend to 90° or more|Letting your hips drop into a regular push-up|2|
bar-plank|Plank on Bars|Core|pb|pbplank|3|30s|45|Grip the push-up bars with straight arms and your hands under your shoulders.;Squeeze your glutes and brace your abs so your body is one straight line.;Hold, breathing steadily.|Gripping the bars keeps your wrists straight and comfortable.|plank|Straight line from head to heels~Shoulders over your hands~Glutes and abs tight|Letting your hips sag or pike up|1|
bar-tap|Plank Shoulder Tap on Bars|Core|pb|pbtap|3|20|30|Hold a high plank with your hands on the bars and your feet a little wider than your hips.;Lift one hand and tap the opposite shoulder.;Put it back down and switch sides, keeping your hips still.|Wider feet make it easier to stay steady.|plank-tap|Hips stay level~Shoulders over the bars~Slow, controlled taps|Rocking your hips from side to side|2|
bar-climber|Mountain Climber on Bars|Cardio|pb|pbclimb|3|30s|30|Hold a high plank with straight arms and your hands on the bars.;Drive one knee toward your chest.;Switch legs quickly, keeping your hips level.|The raised hands make it easier to bring your knees in.|climber|Shoulders over the bars~Hips level~Drive your knees fast|Hips bouncing up and down|2|`.split("\n").forEach(l=>{const[id,name,m,eq,p,s,r,rs,st,tp,alt,ck,bad,lv,hh]=l.split("|");E[id]={id,name,m,eq,p,s:+s,r,rs:+rs,st:st.split(";"),tp,alt,ck:ck.split("~"),bad,lv:+lv||1,hh:hh||""}});
CHAINS.push(["squat","wall-sit"],["bridge","donkey"],["bar-pushup","bar-wide-pushup","bar-pause-pushup","bar-decline-pushup"],["bar-plank","bar-tap","bar-climber"]);
// motions for the new moves
Object.assign(M,{
march:mo([pz([50,49],-90,[58,76],[56,40],{a2:[50,87]}),pz([50,49],-90,[50,87],[44,44],{a2:[58,76]})],["Lift knee","Switch"],[],"",{g:0}),
lswing:mo([pz([50,49],-90,[73,73],[68,46],{a2:[50,87]}),pz([50,49],-90,[28,76],[68,46],{a2:[50,87]})],["Swing forward","Swing back"],[],"",{g:0,pr:PR.wall(80)}),
latlunge:mo([fz([50,49],-90,[46,87],[54,87],[44,46],[56,46]),fz([33,62],-90,[14,87],[62,87],[44,50],[54,50])],["Step wide & sit","Push back"]),
scappush:mo([PLK,ln([14,86],[72,66],[74,86])],["Squeeze blades","Spread wide"],[],"",{g:0}),
wslide:mo([fz([50,49],-90,[46,87],[54,87],[36,36],[64,36]),fz([50,49],-90,[46,87],[54,87],[41,4],[59,4])],["Slide up","Slide down"]),
wrist:mo([fz([50,49],-90,[46,87],[54,87],[43,41],[57,41],{af:.5}),fz([50,49],-90,[46,87],[54,87],[42,38],[58,38],{af:.5}),fz([50,49],-90,[46,87],[54,87],[44,36],[56,36],{af:.5}),fz([50,49],-90,[46,87],[54,87],[45,39],[55,39],{af:.5})],["Circle","Circle"],[],"",{loop:1,g:0}),
aswing:mo([fz([50,49],-90,[46,87],[54,87],[18,28],[82,28]),fz([50,49],-90,[46,87],[54,87],[62,36],[38,40])],["Open wide","Hug across"],[],"",{g:0}),
chestst:mo([pz([48,49],-90,[50,87],[78,28],{a2:[44,87]}),pz([53,49],-84,[52,87],[78,28],{a2:[44,87]})],["Lean in","Ease out"],[],"",{g:0,pr:PR.wall(82)}),
xbody:mo([fz([50,49],-90,[46,87],[54,87],[46,42],[36,34]),fz([50,49],-90,[46,87],[54,87],[46,42],[35,34])],["Hold","Hold"],[],"",{g:0}),
tristr:mo([pz([50,49],-90,[50,87],[44,17],{es:1}),pz([50,49],-90,[50,87],[43,15],{es:1})],["Hold","Hold"],[],"",{g:0}),
spintw:mo([pz([50,84],180,[66,66],[24,86]),pz([50,84],180,[66,72],[24,86])],["Drop knees","Hold"],[],"",{g:0}),
fig4:mo([pz([50,84],180,[76,86],[26,82],{a2:[63,68]}),pz([50,84],180,[74,80],[28,80],{a2:[62,70]})],["Pull in","Hold"],[],"",{g:0}),
calfst:mo([pz([40,56],-72,[58,87],[76,42],{a2:[16,87]}),pz([42,56],-72,[58,87],[76,42],{a2:[16,87]})],["Lean in","Hold"],[],"",{g:0,pr:PR.wall(82)}),
sidebend:mo([fz([50,49],-90,[46,87],[54,87],[46,6],[54,6]),fz([50,49],-78,[46,87],[54,87],[66,8],[60,36])],["Reach over","Return"]),
oreach:mo([fz([50,49],-90,[46,87],[54,87],[46,1],[54,1]),fz([50,49],-90,[46,87],[54,87],[44,-1],[56,-1])],["Reach tall","Breathe"],[],"",{g:0}),
tabext:mo([ln([14,86],[72,43],[72,68]),ln([14,86],[78,52],[72,68])],["Lower head to table","Press up"],[["e",70,180]],"Upper arms stay still",{pr:'<rect x="63" y="69" width="31" height="20" rx="2" fill="#161616" stroke="#4a4a4a" stroke-width="1.3"/>'}),
donkey:mo([QP,pz([40,66],-9.5,[21,86],[64,86],{a2:[12,58],hd:-9.5})],["Kick up","Lower"]),
wallsit:mo([pz([24,67],-90,[43,86],[46,56]),pz([24,67],-90,[43,86],[46,56])],["Hold","Hold"],[["k",80,100]],"Thighs parallel",{g:0,pr:PR.wall(12)}),
pbpush:mo([ln([16,83],[74,54],[74,78]),ln([16,83],[76,68],[74,78])],["Lower to hand level","Press up"],[["e",35,110],["b",165,180]],"Chest to hand level",{pr:PR.lowbar(68,80,80)}),
pbdec:mo([ln([11,57],[72,56],[74,78]),ln([11,57],[74,70],[74,78])],["Lower to hand level","Press up"],[["e",35,110],["b",150,180]],"Chest to hand level",{pr:PR.box(1,60,24,29)+PR.lowbar(68,80,80)}),
pbplank:mo([ln([14,86],[72,55],[74,78]),ln([14,86],[72,55],[74,78])],["Hold steady","Hold steady"],[["b",168,180]],"Straight line",{g:0,pr:PR.lowbar(68,80,80)}),
pbtap:mo([ln([14,86],[72,55],[74,78]),ln([14,86],[72,55],[66,51])],["Tap shoulder","Hand down"],[["b",165,180]],"Hips level",{pr:PR.lowbar(68,80,80)}),
pbpike:mo([pz([41,48],50,[26,85],[72,78],{hd:65}),pz([47,58],26,[26,85],[72,78],{hd:40})],["Head between the bars","Press up"],[["e",50,120]],"Head between the bars",{pr:PR.lowbar(66,78,80)}),
pbclimb:mo([ln([14,83],[72,55],[74,78],{a2:[50,70]}),ln([14,83],[72,55],[74,78],{a:[50,70],a2:[14,83]})],["Drive knee","Switch"],[],"",{g:0,pr:PR.lowbar(68,80,80)})
});

const mix=(P,Q,u)=>{const o={};for(const k in P){const a=P[k],b=Q[k];o[k]=a&&a.map?a.map((v,i)=>v+(b[i]-v)*u):typeof a=="number"?a+(b-a)*u:(u<.5?a:b)}return o};
function ik(p,q,l1,l2,s){let dx=q[0]-p[0],dy=q[1]-p[1],n=Math.hypot(dx,dy)||1,d=Math.min(n,l1+l2-.02);dx/=n;dy/=n;const a=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(l1*l1-a*a,0));return[[p[0]+dx*a+s*dy*h,p[1]+dy*a-s*dx*h],[p[0]+dx*d,p[1]+dy*d]]}
function ikO(p,q,l1,l2,sd){const A=ik(p,q,l1,l2,1),B=ik(p,q,l1,l2,-1);return(A[0][0]-B[0][0])*sd>=0?A:B}
const foot=a=>[a[0]+7,Math.min(87.5,a[1]+4)];
function J(o){if(o.fv)return JF(o);const t=o.t*R,h=o.h,s=[h[0]+24*Math.cos(t),h[1]+24*Math.sin(t)],d=o.hd*R,k=ik(h,o.a,19,19,1),k2=ik(h,o.a2,19,19,1),G={h,s,k,k2,e:ik(s,o.w,12.5,12,o.es>0?1:-1),hp:[s[0]+11.5*Math.cos(d),s[1]+11.5*Math.sin(d)],c:[(h[0]+s[0])/2,(h[1]+s[1])/2+o.b],f:foot(k[1]),f2:foot(k2[1])};G.pts={w:G.e[1],s:[s[0],s[1]-2],f:G.f,k:k[0],h};return G}
function JF(o){const t=o.t*R,u=[Math.cos(t),Math.sin(t)],n=[-u[1],u[0]],ad=(p,v,f)=>[p[0]+v[0]*f,p[1]+v[1]*f],h=o.h,s=ad(h,u,24*o.tl),hL=ad(h,n,-5.5),hR=ad(h,n,5.5),sL=ad(s,n,-8),sR=ad(s,n,8),kL=ikO(hL,o.aL,19*o.lf,19*o.lf,-1),kR=ikO(hR,o.aR,19*o.lf,19*o.lf,1),eL=ikO(sL,o.wL,12.5*o.af,12*o.af,-1),eR=ikO(sR,o.wR,12.5*o.af,12*o.af,1),d=o.hd*R,hp=[s[0]+11.5*o.hs*Math.cos(d),s[1]+11.5*o.hs*Math.sin(d)],fL=[kL[1][0]-4,Math.min(87.5,kL[1][1]+3)],fR=[kR[1][0]+4,Math.min(87.5,kR[1][1]+3)];
return{fv:1,t:[ad(s,n,-6.5),ad(s,n,6.5),ad(h,n,4.5),ad(h,n,-4.5)],h:hL,s:sL,k:kL,e:eL,hp,hc:h,sc:s,hL,hR,sL,sR,kL,kR,eL,eR,fL,fR,pts:{wL:eL[1],wR:eR[1],fL,fR,kL:kL[0],kR:kR[0],s,h,w:eR[1]}}}
function put(g,P){const c=g.children;
if(P.fv){const G=JF(P),eh=P.eh||"B";c[0].setAttribute("points",[G.hL,G.kL[0],G.kL[1],G.fL].join(" "));c[1].setAttribute("points",[G.hR,G.kR[0],G.kR[1],G.fR].join(" "));c[0].style.display=c[1].style.display=P.nl>.5?"none":"";c[2].setAttribute("d",`M${G.t[0]}L${G.t[1]}L${G.t[2]}L${G.t[3]}Z`);c[3].setAttribute("points",[G.sL,G.eL[0],G.eL[1]].join(" "));c[4].setAttribute("points",[G.sR,G.eR[0],G.eR[1]].join(" "));c[5].setAttribute("cx",G.hp[0]);c[5].setAttribute("cy",G.hp[1]);
[[c[6],G.eL[1],"L"],[c[7],G.eR[1],"R"]].forEach(([q,w,sd])=>{const r=q.tagName=="rect";q.setAttribute(r?"x":"cx",w[0]-(r?5:0));q.setAttribute(r?"y":"cy",w[1]-(r?2.5:0));q.style.display=eh=="B"||eh==sd?"":"none"});return G}
const G=J(P),w=G.e[1];c[0].setAttribute("points",[G.h,G.k2[0],G.k2[1],G.f2].join(" "));c[1].setAttribute("d",`M${G.h}Q${G.c} ${G.s}`);c[2].setAttribute("points",[G.h,G.k[0],G.k[1],G.f].join(" "));c[3].setAttribute("points",[G.s,G.e[0],w].join(" "));c[4].setAttribute("cx",G.hp[0]);c[4].setAttribute("cy",G.hp[1]);const q=c[5],r=q.tagName=="rect";q.setAttribute(r?"x":"cx",w[0]-(r?5:0));q.setAttribute(r?"y":"cy",w[1]-(r?2.5:0));return G}
const bg=(c,e,F)=>{const b=c=="bd",w=(k,x)=>b?` stroke="${k}" stroke-width="${x}"`:"",q=b&&(e=="db"||e=="bag")?'<rect width="10" height="5" rx="2" fill="#fff" stroke="none"/>':b&&e=="kb"?'<circle r="5" fill="#fff" stroke="none"/>':'<circle r="0"/>',hd=`<circle r="5.5"${b?' fill="#fff" stroke="none"':""}/>`;return`<g class="${c}" ${b?'stroke="#fff"':'stroke="#6a6a6a" stroke-width="2.6" stroke-dasharray="1.5 3.2"'}>${F?`<polyline${w("#fff",4.5)}/><polyline${w("#fff",4.5)}/><path${w("#fff",3)}${b?' fill="#fff"':""}/><polyline${w("#fff",4)}/><polyline${w("#fff",4)}/>${hd}${q}${q}`:`<polyline${w("#6a6a6a",4)}/><path${w("#fff",5.5)}/><polyline${w("#fff",4.5)}/><polyline${w("#fff",4)}/>${hd}${q}`}</g>`};
// band anchors: a post from the floor, or a hook from above
const anc=sp=>sp.flat().filter(Array.isArray).map(([x,y])=>(y>8?`<path d="M${x} 89V${y}" stroke="#444" stroke-width="2.5"/>`:`<path d="M${x-7} -5H${x+7}M${x} -5V${y}" stroke="#444" stroke-width="2.5"/>`)+`<circle cx="${x}" cy="${y}" r="1.8" fill="#777" stroke="none"/>`).join("");
function band(s,G){const sp=BN[s.dataset.id],el=s.querySelector(".bn");if(!sp||!el)return;const P=k=>Array.isArray(k)?k:G.pts[k]||G.pts.w;el.setAttribute("d",sp.map(([a,b])=>a=="loop"?(q=>`M${q[0]-3.4},${q[1]}a3.4,2.4 0 1,0 6.8,0a3.4,2.4 0 1,0 -6.8,0`)(P(b)):`M${P(a)}L${P(b)}`).join(""))}
const fig=(e,live)=>{const p=e.p,m=M[p],X=m.m,F=!!m.P[0].fv,bn=BN[e.id];return`<svg class="fig" ${live?'data-live="1"':""} data-p="${p}" data-id="${e.id}" viewBox="0 -5 100 95" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${m.nf?"":'<line x1="6" x2="94" y1="89" y2="89" stroke="#2b2b2b" stroke-width="1.5"/>'}${m.pr||""}${bn?anc(bn):""}${live&&m.g!==0?bg("gh",e.eq,F):""}${bg("bd",e.eq,F)}${bn?'<path class="bn" stroke="#a0a0a0" stroke-width="1.7"/>':""}${live?X.map(d=>d[0]=="b"?'<line class="gl" stroke-width="1.3" stroke-dasharray="3 2.5"/>':"").join("")+X.map((d,j)=>`<path class="ar${j}" stroke-width="1.6"/><text class="tx${j}" font-size="5.5" font-weight="700" text-anchor="middle" stroke="#000" stroke-width="1.3" paint-order="stroke" style="font-family:var(--lb)"/>`).join(""):""}</svg>`};
const hud=`<div class="hud"><span class="ph">Ready</span><span class="rc">Rep 1</span></div><div class="cue"></div><i class="pg"></i>`;
const fc=e=>`<h2>Form checks</h2><ul class="fc">${e.ck.map(c=>`<li>${ic("chk",16,3)}<span>${c}</span></li>`).join("")}</ul><div class="note bad"><b>Avoid.</b> ${e.bad}</div><p class="mu" style="font-size:13.5px;margin:10px 0 18px">Exhale on the effort, inhale on the way back.</p>`;
function live(s,t){const m=M[s.dataset.p],q=m.q,f=(+s.dataset.sp||3)/3,tt=t/1000/f,cy=q.length*CY,w=tt%cy,k=Math.floor(w/CY),lc=w-k*CY,i0=q[k],i1=q[(k+1)%q.length],mv=lc>HD,u=mv?ease((lc-HD)/MV):0,rep=Math.floor(tt/cy)+1,G=put(s.querySelector(".bd"),mix(m.P[i0],m.P[i1],u)),gh=s.querySelector(".gh"),d=s.parentNode,ck=(E[s.dataset.id]||{}).ck||[];
s.__P=mix(m.P[i0],m.P[i1],u);s.__G=G;s.__mv=mv;band(s,G);if(gh)put(gh,m.P[m.P.length-1]);let ok=0;const nb=m.m.some(x=>x[0]!="b");
m.m.forEach((x,j)=>{const[ty,lo,hi]=x,[a,b,c]=ty=="k"?[G.h,G.k[0],G.k[1]]:ty=="h"?[G.s,G.h,G.k[0]]:ty=="e"?[G.s,G.e[0],G.e[1]]:ty=="a"?[G.h,G.s,G.e[1]]:[G.s,G.h,G.k[1]],A=an(a,b,c),g=A>=lo&&A<=hi,col=g?"#fff":"#8c8c8c",n1=un(V(b,a)),n2=un(V(b,c)),bs=[-(n1[0]+n2[0]),-(n1[1]+n2[1])],bl=Math.hypot(bs[0],bs[1]),ar=s.querySelector(".ar"+j),tx=s.querySelector(".tx"+j);
if(g&&(ty!="b"||!nb))ok=1;
ar.setAttribute("d",A>172?"":`M${b[0]+n1[0]*8},${b[1]+n1[1]*8}A8,8 0 0 ${n1[0]*n2[1]-n1[1]*n2[0]>0?1:0} ${b[0]+n2[0]*8},${b[1]+n2[1]*8}`);ar.setAttribute("stroke",col);tx.setAttribute("fill",col);
tx.setAttribute("x",bl<.3?b[0]:b[0]+bs[0]/bl*14);tx.setAttribute("y",(bl<.3?b[1]-9:b[1]+bs[1]/bl*14)+2);tx.textContent=Math.round(A)+"°";
if(ty=="b"){const l=s.querySelector(".gl");l.setAttribute("x1",G.k[1][0]);l.setAttribute("y1",G.k[1][1]);l.setAttribute("x2",G.hp[0]);l.setAttribute("y2",G.hp[1]);l.setAttribute("stroke",g?"#000":col)}});
const T=(c,v)=>{const e=d.querySelector(c);if(e&&e.textContent!==v)e.textContent=v};
T(".ph",ok&&m.tg?"✓ "+m.tg:mv?(i1>i0?m.lb[0]:m.lb[1]):(i0?"Hold":"Ready"));T(".rc","Rep "+rep);if(ck.length)T(".cue",ck[(rep-1)%ck.length]);
d.classList.toggle("ok",!!ok);const ph=d.querySelector(".ph");if(ph)ph.classList.toggle("ok",!!ok);const pg=d.querySelector(".pg");if(pg)pg.style.width=w/cy*100+"%"}
const still=()=>document.querySelectorAll(".fig:not([data-live])").forEach(s=>{const P=M[s.dataset.p].P,G=put(s.querySelector(".bd"),P[Math.min(1,P.length-1)]);band(s,G)});
(function loop(t){document.querySelectorAll(".fig[data-live]").forEach(x=>live(x,t));requestAnimationFrame(loop)})(0);
/* ================= Fitforg v2 · state, schedule and planner ================= */
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],DN=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const mid=d=>new Date(d.getFullYear(),d.getMonth(),d.getDate()),addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n),dow=d=>(d.getDay()+6)%7,mon0=d=>addD(d,-dow(d));
const iso=d=>d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(),dy=n=>addD(new Date(),-n),parseIso=s=>{const p=s.split("-").map(Number);return new Date(p[0],p[1]-1,p[2])};
const dlab=d=>DN[dow(d)].slice(0,3)+" "+d.getDate()+" "+MON[d.getMonth()];

// session length (total minutes, warm-up and cool-down included) and how it is split
// warm-up: ACSM asks for at least 5-10 min of light-to-moderate movement, so no session gets less than 5
const LENS=[20,30,45,60],PH={20:{w:5,c:3},30:{w:5,c:4},45:{w:6,c:5},60:{w:7,c:6}};
// break between the last warm-up move and the first work set: time to catch your breath and set up your gear,
// short enough that the warm-up doesn't wear off (muscle temperature starts dropping within 15-30 min of stopping)
const TRANS=60;
// bump when the way plans are built changes, so today's plan rebuilds if it hasn't been started yet
const PV=2;
// furniture / household things a hostel room may or may not have
const HOME=[["chair","Sturdy chair"],["table","Table or desk"],["wall","Free wall"],["step","Step or stairs"],["towel","Towel"],["door","Solid door"]];
const SHORT={db:"Dumbbells",pb:"Push-up bars",bar:"Bar",band:"Band",kb:"Kettlebell",bag:"Backpack",chair:"Chair",table:"Table",wall:"Wall",step:"Step",towel:"Towel",door:"Door"};

// ---------- state ----------
let S=null;try{S=JSON.parse(localStorage.getItem("ff4"))}catch(e){}
if(!S){let o=null;try{o=JSON.parse(localStorage.getItem("ff3"))}catch(e){}S={};if(o){S.gear=o.gear;S.mine=o.mine;S.h=o.h;S.eqSet=o.eqSet}}
S.gear=S.gear||{};S.home=S.home||{};S.mine=(S.mine||[]).filter(i=>E[i]);S.h=S.h||{};S.ov=S.ov||{};S.n=S.n>0?Math.floor(S.n):0;S.vc=S.vc||{};
S.days=[3,4,5,6].includes(S.days)?S.days:4;if(!(S.len>=20))S.len=30;if(!LENS.includes(S.len))S.len=LENS.reduce((a,b)=>Math.abs(b-S.len)<Math.abs(a-S.len)?b:a);
if(!S.t0)S.t0=iso(new Date());   // first day of use: earlier days of this week are never counted as missed
// schedule history: which training-day count applied from which date, so changing it never rewrites the past
if(!Array.isArray(S.sch)||!S.sch.length||S.sch.some(x=>!x||!x.f||![3,4,5,6].includes(x.d)))S.sch=[{f:S.t0,d:S.days}];
if(S.sch[S.sch.length-1].d!==S.days)S.sch.push({f:iso(new Date()),d:S.days});
if(S.eqSet&&S.gear.bw==null)S.gear.bw=1;   // everyone who set up before had bodyweight on
if(!S.eqSet&&!BASE.some(g=>S.gear[g[0]]))S.gear.bw=1;   // first setup starts with Bodyweight on (can be turned off)
S.tab=S.tab||"today";S.q=S.q||"";S.mu=S.mu||"All";
// rest-timer notifications: S.nt is 1 (on), 0 (off) or unset (never asked)
if(S.nt==null&&notifyPermission()==="granted")S.nt=1;
const ntOn=()=>S.nt===1&&notifyPermission()==="granted";notifyEnabled(ntOn);
for(const k in S.ov){if(k!==iso(new Date())||S.ov[k]==="rec"||S.ov[k]==="rest")delete S.ov[k]}   // only today can be changed by hand
if(S.fz&&(!S.fz.L||S.fz.L.some(x=>!E[x.id])))S.fz=null;
const hydrate=x=>{Object.defineProperty(x,"e",{value:E[x.id],writable:true,enumerable:false});return x};
if(S.fz){S.fz.L.forEach(hydrate);S.fz.sd=S.fz.sd||{}}
const save=()=>{try{localStorage.setItem("ff4",JSON.stringify(S))}catch(e){}};

// ---------- availability ----------
const hhOk=h=>!h||h.split("-").every(k=>S.home[k]!==0);
// Bodyweight is a choice like any other kit. Stretches and warm-up moves need no kit, so they are always available.
const av=e=>(!!S.gear[e.eq]||(e.eq==="bw"&&e.m==="Mobility"))&&hhOk(e.hh);
const avw=e=>(e.eq==="bw"||!!S.gear[e.eq])&&hhOk(e.hh);
const need=e=>{if(!S.gear[e.eq]&&!(e.eq==="bw"&&e.m==="Mobility"))return e.eq;if(e.hh)for(const k of e.hh.split("-"))if(S.home[k]===0)return k;return null};
const gname=k=>{const b=BASE.find(g=>g[0]===k);if(b)return b[2];const h=HOME.find(g=>g[0]===k);return h?h[1]:k};
const needKeys=L=>{const s=new Set();L.forEach(x=>{const e=x.e;if(e.eq!=="bw")s.add(e.eq);if(e.hh)e.hh.split("-").forEach(h=>s.add(h))});return[...s]};

// ---------- weekly schedule: a rolling queue ----------
// Your training days take the next workout in a cycle. Whatever you don't do simply stays "up next",
// so a missed day never needs fixing: the same workout is waiting for you the next day.
const CYC={3:["full","full","full"],4:["upper","legs","upper","legs"],5:["push","pull","legs","upper","legs"],6:["push","pull","legs","push","pull","legs"]};
const TRAIN={3:[1,0,1,0,1,0,0],4:[1,1,0,1,1,0,0],5:[1,1,1,0,1,1,0],6:[1,1,1,1,1,1,0]};   // Mon..Sun
const SPLITD={3:"Full body on Mon, Wed and Fri. Every session trains your whole body.",4:"Upper body and legs, each twice a week: Mon, Tue, Thu and Fri.",5:"Push, pull, legs, then upper and legs: Mon, Tue, Wed, Fri and Sat.",6:"Push, pull and legs twice a week, Monday to Saturday."};
// the training-day count in force on a given day (past days keep the schedule they had)
const daysOn=d=>{const x=mid(d);let r=S.sch[0].d;for(const e of S.sch)if(parseIso(e.f)<=x)r=e.d;return r};
const cyc=()=>CYC[S.days],isTrain=d=>!!TRAIN[daysOn(d)][dow(d)];
// a workout you have no kit for is skipped in the queue instead of blocking it
// core moves alone don't make a Legs or Pull day: a workout needs at least two of its own exercises
const CORE=new Set(["core","cplank","cdead","crot","clow","cside","cdyn"]);
const nCan=k=>{if(k==="mine")return S.mine.filter(id=>E[id]&&av(E[id])).length;const w=WO[k];if(!w)return 0;const o=new Set();w.sl.forEach(sl=>{if(w.ty!=="c"&&CORE.has(sl))return;(SL[sl]||[]).forEach(id=>{if(E[id]&&av(E[id]))o.add(id)})});return o.size};
const canDo=k=>k==="mine"?nCan(k)>0:nCan(k)>=2;
const offFrom=p=>{const L=cyc().length;for(let j=0;j<L;j++)if(canDo(cyc()[(p+j)%L]))return j;return 0};
const nextKey=()=>cyc()[(S.n+offFrom(S.n))%cyc().length];
const SH={full:"Full",push:"Push",pull:"Pull",legs:"Legs",upper:"Upper",chest:"Chest",arms:"Arms",shoulders:"Delts",core:"Core",cardio:"Cardio",mine:"Mine",rest:"Rest"};

// ---------- workout recipes: each program is an ordered list of movement slots ----------
// A slot is a movement pattern. The planner fills it with the first exercises you can actually do with your equipment.
const SL={
sq:["squat-goblet","kb-goblet","bag-squat","band-squat","db-sumo","squat","sumo-squat"],
hing:["rdl","kb-deadlift","bag-rdl","band-gm","pull-through","goodmorning"],
uni:["split-squat","db-lunge","db-rev-lunge","kb-lunge","bag-lunge","bw-split","lunge-rev","step-up","bw-step-up"],
glute:["db-bridge","band-bridge","bag-bridge","sl-bridge","bridge","donkey"],
calf:["db-calf-raise","calf"],
leg2:["step-up","kb-curtsy","wall-sit","sumo-squat","lateral-walk","bw-step-up","donkey","squat-jump"],
push:["pushup","bar-pushup","db-floor-press","band-chest-press","bag-press","wide-pushup","incline-pushup"],
push2:["wide-pushup","bar-wide-pushup","db-squeeze-press","stagger-pushup","bar-pause-pushup","pause-pushup","db-fly","bar-decline-pushup","decline-pushup","incline-pushup"],
ohp:["press","kb-press","band-press","db-arnold","pike","bar-pike","pike-elev"],
delt:["lat-raise","band-lat-raise","front-raise","plank-pike","wall-hold"],
tri:["dip","tri-ext","pushup-close","bar-close-pushup","table-tri-ext","diamond-pushup","kickback","pushdown"],
vpull:["pullup","chinup","wide-pullup","neg-pullup"],
row:["row","db-bent-row","kb-row","band-row","bag-row","towel-row","aus-row"],
row2:["towel-row","band-row","aus-row","kb-row","db-bent-row","bag-row","row"],
rear:["rear-fly","band-apart","face-pull","prone-y","prone-t","snow-angel"],
bi:["curl","db-hammer","band-curl","towel-curl"],
back:["superman","back-widow","prone-y","dead-hang","prone-t"],
core:["plank","bar-plank","deadbug","bicycle","side-plank","russian-twist","bird-dog","leg-raise","plank-tap","bar-tap","bar-climber"],
cplank:["plank","bar-plank","plank-tap","bar-tap","hollow"],cdead:["deadbug","bird-dog"],crot:["russian-twist","bicycle","kb-twist","pallof"],clow:["leg-raise","rev-crunch","flutter","hang-knee","crunch"],cside:["side-plank","pallof","bicycle"],cdyn:["climber","bar-climber","v-up","plank-tap","bar-tap"],
cardio:["jumping-jack","high-knees","squat-jump","climber","bar-climber","skater","burpee","shadow-box","butt-kick","bear-crawl","tuck-jump","swing","inchworm"]};
const WO={
full:{n:"Full body",d:"Legs, push, pull and core in one session",ty:"f",sl:["sq","push","row","hing","ohp","uni","core","tri","rear","glute"]},
upper:{n:"Upper body",d:"Chest, back, shoulders and arms",ty:"u",sl:["push","row","ohp","vpull","tri","bi","rear","delt","core"]},
legs:{n:"Legs",d:"Quads, glutes, hamstrings and calves",ty:"l",sl:["sq","hing","uni","glute","calf","leg2","uni","core"]},
push:{n:"Push",d:"Chest, shoulders and triceps",ty:"p",sl:["push","ohp","push2","tri","delt","tri","core"]},
pull:{n:"Pull",d:"Back, rear shoulders and biceps",ty:"u",sl:["vpull","row","row2","rear","bi","back","bi","core"]},
core:{n:"Core",d:"Abs, obliques and lower back",ty:"c",sl:["cplank","cdead","crot","clow","cside","cdyn","cplank","crot"]},
cardio:{n:"Cardio",d:"Get your heart rate up, no weights",ty:"v",sl:["cardio","cardio","cardio","cardio","cardio","cardio","cardio","cardio","cardio","cardio"]},
chest:{n:"Chest",d:"Chest, front shoulders and triceps",ty:"p",sl:["push","push2","push2","push","tri","delt"]},
arms:{n:"Arms",d:"Biceps and triceps",ty:"p",sl:["bi","tri","bi","tri","bi","tri"]},
shoulders:{n:"Shoulders",d:"Shoulders and upper back",ty:"p",sl:["ohp","delt","rear","delt","ohp","rear"]},};
const PORDER=["full","upper","legs","push","pull","core","cardio","chest","arms","shoulders"];
const pname=k=>k==="mine"?"My workout":k==="rest"?"Rest day":WO[k]?WO[k].n:"Workout",pdesc=k=>k==="mine"?"Your own list of exercises":k==="rest"?"Recovery day":WO[k]?WO[k].d:"";
if(S.fz&&!(S.fz.k==="mine"||WO[S.fz.k]))S.fz=null;
// warm-up (RAMP style): "raise" = 2-3 min of easy cardio that builds from easy (e) to brisk (r), because muscle
// temperature climbs over the first 3-5 min of movement; then joint mobility and activation (m) for the day's muscles.
// The light first work set ("take this first set a little easier") is the exercise-specific part.
const WARM={
p:{e:["march"],r:["jumping-jack","shadow-box"],m:["arm-circles:20","wrist-circle:10","scap-pushup:10","catcow:8","wall-slide:10","t-spine:6","arm-swing:20","band-apart:15","inchworm:5"]},
u:{e:["march"],r:["jumping-jack","high-knees"],m:["arm-circles:20","catcow:8","t-spine:6","wall-slide:10","band-apart:15","scap-pull:6","scap-pushup:10","wrist-circle:10","arm-swing:20","inchworm:5"]},
l:{e:["march"],r:["high-knees","butt-kick"],m:["leg-swing:10","squat:10","lat-lunge:6","wgs:4","bridge:12","hip90:6","goodmorning:10","catcow:8","inchworm:5","bird-dog:6"]},
f:{e:["march"],r:["jumping-jack","high-knees"],m:["arm-circles:20","squat:10","wgs:4","inchworm:5","bridge:10","leg-swing:10","scap-pushup:10","catcow:8","t-spine:6","wall-slide:10","lat-lunge:6","arm-swing:20"]},
c:{e:["march"],r:["jumping-jack","shadow-box"],m:["catcow:8","bird-dog:6","bridge:10","t-spine:6","wgs:4","hip90:6","inchworm:5","scap-pushup:10","arm-swing:20"]},
v:{e:["march"],r:["jumping-jack","high-knees"],m:["arm-circles:20","leg-swing:10","squat:10","wgs:4","inchworm:5","lat-lunge:6","hip90:6","arm-swing:20"]}};
// raise time in seconds for a warm-up of w minutes: 2 min at 5, 2.5 at 6, 3 at 7
const raiseSec=w=>Math.max(90,(w-1)*30);
// cool-down: static holds (10-30 s each, ACSM) chosen by which muscles the session worked. [id, hold, muscles, order]
const COOL=[
["xbody-stretch","30s",["shoulders","upperback"],1],["tri-stretch","30s",["triceps","shoulders","lats"],2],["chest-stretch","30s",["chest","biceps","shoulders"],3],["side-bend","20s",["lats","core"],4],
["quad-stretch","30s",["quads"],5],["calf-stretch","30s",["calves"],6],["down-dog","30s",["hams","calves","shoulders","lats"],7],["hip-flexor","30s",["hipflex","quads"],8],
["ham-stretch","30s",["hams","back"],9],["fig4","30s",["glutes","hips"],10],["spinal-twist","30s",["back","glutes","core"],11],["childs-pose","40s",["lats","back","shoulders"],12],["cobra","20s",["core","hipflex","chest"],13],["overhead-reach","30s",["lats","core","shoulders"],14]];
const SD=new Set(["leg-swing","lat-lunge","wgs","t-spine","hip-flexor","quad-stretch","chest-stretch","xbody-stretch","tri-stretch","spinal-twist","fig4","calf-stretch","side-bend"]);
const BLN={w:"Warm-up",m:"Workout",c:"Cool-down"};
const blname=b=>BLN[b];

// which muscles an exercise works (drives the cool-down)
function mtags(e){const n=e.name.toLowerCase(),g=e.m,o={},a=(k,w)=>o[k]=Math.max(o[k]||0,w);
if(g==="Chest"){a("chest",1);a("triceps",.5);a("shoulders",.5)}
else if(g==="Back"){a("lats",1);a("upperback",.8);a("biceps",.5)}
else if(g==="Shoulders"){a("shoulders",1);a("triceps",.4);a("upperback",.3)}
else if(g==="Arms"){if(/tricep|dip|kickback|pushdown|close|diamond/.test(n)){a("triceps",1);a("chest",.3);a("shoulders",.3)}else{a("biceps",1);a("lats",.2)}}
else if(g==="Legs"){if(/bridge|donkey/.test(n)){a("glutes",1);a("hams",.6);a("quads",.2)}else if(/deadlift|rdl|romanian|good morning|pull-through/.test(n)){a("hams",1);a("glutes",.9);a("back",.4)}else if(/calf/.test(n)){a("calves",1)}else{a("quads",1);a("glutes",.8);a("hams",.3);a("hipflex",.4)}}
else if(g==="Core"){a("core",1);a("hipflex",.3);a("back",.2)}
else if(g==="Cardio"){a("quads",.6);a("calves",.5);a("shoulders",.3);a("core",.3)}
return o}

// ---------- building a session ----------
const wk=x=>/s$/.test(x.r)?parseInt(x.r):(parseInt(x.r)||10)*3;
const sec=x=>x.s*wk(x)+(x.s-1)*x.rs+(x.b==="m"?20:6);
function mk(id,b,o){o=o||{};const e=E[id],sd=SD.has(id),v=o.val||e.r;
const x={id,b,s:o.s!=null?o.s:sd?2:b==="m"?e.s:1,r:v,rs:sd?3:b==="m"?e.rs:6,sl:o.sl||"",sd:sd?1:0,from:o.from||""};return hydrate(x)}
function pick(key,used,v,i){const c=(SL[key]||[]).filter(id=>E[id]&&av(E[id])&&!used[id]);if(!c.length)return null;return c[(v+i)%Math.min(3,c.length)]}
// each time you finish a workout the next one of that kind swaps in different exercises
const variantFor=(d,k)=>S.vc[k]||0;
function build(k,d,len){const P=PH[len]||PH[30],v=variantFor(d,k);let warm=[],main=[],cool=[];
{const prog=k==="mine"?{ty:"f",sl:[]}:WO[k],budget=(len-P.w-P.c)*60-(TRANS-6),used={};let t=0;
if(k==="mine"){S.mine.forEach(id=>{const e=E[id],r=av(e)?e:(E[e.alt]&&av(E[e.alt])?E[e.alt]:null);if(!r||used[r.id])return;used[r.id]=1;main.push(mk(r.id,"m",{from:r===e?"":e.id}))})}
else{const n=prog.sl.length,tol=25;
for(let i=0;i<n;i++){const id=pick(prog.sl[i],used,v,i);if(!id)continue;const x=mk(id,"m",{sl:prog.sl[i]});if(main.length>=3&&t+sec(x)>budget+tol)break;used[id]=1;main.push(x);t+=sec(x)}
// a long session on a short recipe: go round the recipe again with the next-best exercise for each slot
for(let r=1;r<=2&&t<budget-80&&len>=30;r++)for(let i=0;i<n;i++){const key=prog.sl[i];if(CORE.has(key)&&prog.ty!=="c")continue;const id=pick(key,used,v+r,i);if(!id)continue;const x=mk(id,"m",{sl:key});if(t+sec(x)>budget+tol)continue;used[id]=1;main.push(x);t+=sec(x)}
main.sort((a,b)=>(CORE.has(a.sl)&&prog.ty!=="c"?1:0)-(CORE.has(b.sl)&&prog.ty!=="c"?1:0));
if(len>=45){let left=budget-t;for(let pass=0;pass<2;pass++)for(const x of main){if(x.s>=4)continue;const add=wk(x)+x.rs;if(left>=add+60){x.s++;left-=add}}}}
// warm-up
const W=WARM[prog.ty],inMain=new Set(main.map(x=>x.id)),ok=s=>{const id=s.split(":")[0];return E[id]&&avw(E[id])&&!inMain.has(id)},goal=P.w*60;let tw=0;
// raise: an easy move, then a brisker one (or one of them for the whole time if the other isn't available)
const ez=W.e.filter(ok),bz=W.r.filter(ok),R=raiseSec(P.w),rs5=n=>Math.round(n/5)*5+"s",raise=[];
if(ez.length)raise.push(ez[v%ez.length]);if(bz.length)raise.push(bz[v%bz.length]);
raise.forEach(id=>{const x=mk(id,"w",{val:rs5(R/raise.length)});warm.push(x);tw+=sec(x)});
// mobility and activation for the day's muscles
for(const s of W.m.filter(ok)){if(tw>=goal-20)break;const[id,val]=s.split(":"),x=mk(id,"w",{val});warm.push(x);tw+=sec(x)}
// not enough mobility moves for your gear and room: stretch the raise moves so the warm-up still reaches its minimum
if(tw<goal-20&&raise.length){const per=(goal-tw)/raise.length;warm.slice(0,raise.length).forEach(x=>{const nv=Math.min(150,parseInt(x.r)+per);tw+=nv-parseInt(x.r);x.r=rs5(nv)})}
// cool-down
const wt={};main.forEach(x=>{const tg=mtags(E[x.id]);for(const q in tg)wt[q]=(wt[q]||0)+tg[q]*x.s});
const pool=COOL.filter(c=>avw(E[c[0]])).map(c=>({c,sc:0})),ch=[];let tc=0;
while(pool.length&&(ch.length<2||tc<P.c*60-20)){pool.forEach(p=>p.sc=p.c[2].reduce((a,q)=>a+(wt[q]||0),0)-p.c[3]*.001);pool.sort((a,b)=>b.sc-a.sc);const p=pool.shift();if(p.sc<=0&&ch.length>=2)break;ch.push(p.c);p.c[2].forEach(q=>wt[q]=(wt[q]||0)*.35);tc+=sec(mk(p.c[0],"c",{val:p.c[1]}))}
ch.sort((a,b)=>a[3]-b[3]);cool=ch.map(c=>mk(c[0],"c",{val:c[1]}))}
return{k,L:[...warm,...main,...cool]}}
const mins=L=>{const g=b=>L.filter(x=>x.b===b).reduce((a,x)=>a+sec(x),0),tr=L.some(x=>x.b==="w")&&L.some(x=>x.b==="m")?TRANS-6:0,w=Math.round(g("w")/60),c=Math.round(g("c")/60),m=Math.max(1,Math.round((g("m")+tr)/60));return{w,m,c,tot:w+m+c}};
const key=x=>x.b+":"+x.id;

// ---------- today's plan is frozen once built so it never changes under you ----------
// done: finished (1) or skipped (2) moves · sd: sets already done per move, so a resumed session picks up at the right set
const started=F=>!!F&&(Object.keys(F.done).length>0||Object.keys(F.sd||{}).length>0);
function plan(){const now=new Date(),t=iso(now),k=todayKey();if(k==="rest")return null;
if(!S.fz||S.fz.d!==t||S.fz.k!==k||((S.fz.len!==S.len||S.fz.pv!==PV)&&!started(S.fz))){S.fz={d:t,k,len:S.len,pv:PV,L:build(k,now,S.len).L,done:{},sd:{}};save()}
return S.fz}
// drop today's plan so it rebuilds with new settings, unless you've already started it. Returns false when a started session was kept.
const invalidate=()=>{if(S.fz&&S.fz.d===iso(new Date())&&started(S.fz))return false;S.fz=null;return true};

// ---------- history helpers ----------
const hday=n=>S.h[iso(dy(n))]||{s:0,r:0};
const isFin=h=>!!h&&(!!h.fin||(h.fin==null&&h.s>0));
const fmt=n=>n>=1e4?Math.round(n/1e3)+"k":n>=1e3?(n/1e3).toFixed(1)+"k":""+n;
const wkCount=off=>{const m=addD(mon0(new Date()),-7*off);let n=0;for(let i=0;i<7;i++){if(isFin(S.h[iso(addD(m,i))]))n++}return n};
const doneOn=d=>isFin(S.h[iso(d)]),anyDone=()=>Object.values(S.h).some(isFin);
// the last training day you missed (and haven't trained since), if any
function lateDay(d){const t0=parseIso(S.t0);for(let j=1;j<=7;j++){const p=addD(d,-j);if(p<t0)return null;if(doneOn(p))return null;if(isTrain(p))return p}return null}
// what today holds: the workout you picked, what you finished, the next one in the queue, or rest
function todayKey(){const t=new Date(),i=iso(t),h=S.h[i];
if(S.ov[i])return S.ov[i];
if(isFin(h)&&h.w&&S.more!==i)return h.w;
return isTrain(t)||lateDay(t)||!anyDone()?nextKey():"rest"}
// the remaining days of this week, filled from the queue
function weekAhead(){const n=new Date(),o={};let p=S.n;const tk=todayKey();if(!doneOn(n)&&tk!=="rest"&&tk===nextKey())p+=offFrom(p)+1;
for(let j=1;j<=6-dow(n);j++){const d=addD(n,j);if(isTrain(d)){const j2=offFrom(p);o[iso(d)]=cyc()[(p+j2)%cyc().length];p+=j2+1}else o[iso(d)]="rest"}return o}
function nextTrainDay(){const n=new Date();for(let j=1;j<=7;j++){const d=addD(n,j);if(isTrain(d))return{d,label:j===1?"Tomorrow":DN[dow(d)]}}return null}
// give today a different workout. The one you skip stays up next, so it is waiting for you tomorrow.
// where the queue continues after the training days change: after the last workout you finished that the new cycle has (or its closest match)
function queueAfter(){const C=cyc(),EQ={upper:["pull","push"],push:["upper"],pull:["upper"],full:["legs"]},ds=Object.keys(S.h).filter(k=>isFin(S.h[k])&&S.h[k].w).sort((a,b)=>parseIso(b)-parseIso(a));
for(const k of ds){const w=S.h[k].w;for(const c of[w,...(EQ[w]||[])]){const i=C.indexOf(c);if(i>=0)return i+1}}return 0}
function choose(d,k){const i=iso(d);if(S.fz&&S.fz.d===i&&S.fz.k===k&&!doneOn(d))return;if(doneOn(d))S.more=i;S.ov={[i]:k};S.fz=null;save()}

/* ================= Fitforg v2 · screens ================= */
const rp=r=>/s$/.test(r)?r.replace("s"," sec"):r+" reps";
const spec=x=>{const t=/s$/.test(x.r),n=parseInt(x.r);let a;if(t)a=x.sd?n+" sec each side":x.s>1?x.s+" × "+n+" sec":n+" sec";else a=x.sd?n+" each side":x.s>1?x.s+" × "+n:n+" reps";return a+(x.e.eq!=="bw"?" · "+gname(x.e.eq):"")};
function toast(m){const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=m;$("#app").append(t);setTimeout(()=>t.remove(),2800)}
function nav(){$("#nav").innerHTML=[["today","Today"],["stats","Progress"],["library","Explore"]].map(([k,l])=>`<button data-a="tab" data-v="${k}" class="${S.tab===k?"cur":""}" aria-label="${l}" aria-current="${S.tab===k}">${ic(k,22)}<span>${l}</span></button>`).join("")}
const MARK='<svg class="mk" viewBox="0 0 471 488" aria-hidden="true"><use href="#ff-mark"/></svg>';
const topBar=()=>{const d=wkCount(0),g=S.days;return`<div class="top"><span class="brand">${MARK}<span><b>FIT</b>FORG</span></span><span class="tr"><button class="wc" data-a="tab" data-v="stats" aria-label="${d} of ${g} workouts done this week"><b>${d}</b><span>/${g} this week</span></button><button class="ibtn" data-a="settings" aria-label="Settings">${ic("cog",20)}</button></span></div>`};

// ---------- demo slot: plays /videos/exercises/<id>.mp4 when it exists, otherwise shows the form guide with a placeholder tag ----------
const demo=(e,st)=>`<div class="demo" data-id="${e.id}"${st||""}>${fig(e,1)}${hud}<span class="vph">${ic("play",10,0)}Demo video coming soon</span></div>`;
const VC={};   // exercise id -> 1 (video found) or 0 (none), so a missing video is only looked for once per visit
function vid(root){root.querySelectorAll(".demo[data-id]:not([data-v])").forEach(d=>{d.dataset.v=1;if(VC[d.dataset.id]===0)return;const v=document.createElement("video");v.onerror=()=>{VC[d.dataset.id]=0};v.muted=true;v.loop=true;v.autoplay=true;v.setAttribute("playsinline","");v.preload="auto";
v.onloadeddata=()=>{VC[d.dataset.id]=1;if(!d.isConnected)return;d.classList.add("vid");d.prepend(v);v.play().catch(()=>{});const b=document.createElement("button");b.className="sp vd";b.textContent="1x";b.setAttribute("aria-label","Playback speed");b.onclick=ev=>{ev.stopPropagation();const r=[1,.5,1.5],i=(r.indexOf(v.playbackRate)+1)%3;v.playbackRate=r[i];b.textContent=r[i]+"x"};d.append(b);v.onclick=()=>v.paused?v.play():v.pause()};
v.src="/videos/exercises/"+d.dataset.id+".mp4"})}

// ---------- Today ----------
const row=(x,i,F)=>{const dn=F.done[key(x)];return`<div class="xr2${dn?" dn":""}"><button class="xr2-m" data-a="openx" data-v="${i}"><span class="th">${fig(x.e)}${dn?`<i class="tk">${ic(dn===2?"skip":"chk",11,3.5)}</i>`:""}</span><span class="xr2-t"><strong>${x.e.name}</strong><span class="m">${spec(x)}</span></span></button><button class="xr2-s" data-a="swap" data-v="${i}" aria-label="Swap ${x.e.name}">${ic("swap",18)}</button></div>`};
function blocks(F){const L=F.L,k=F.k;return["w","m","c"].map(b=>{const g=L.map((x,i)=>[x,i]).filter(([x])=>x.b===b);if(!g.length)return"";const m=Math.max(1,Math.round(g.reduce((a,[x])=>a+sec(x),0)/60));
return`<details class="blk ${b}"${b==="m"?" open":""}><summary><i class="dot"></i><b>${blname(b,k)}</b><span>${g.length} ${g.length===1?"move":"moves"} · ${m} min</span>${ic("chev",16,2.4)}</summary>${g.map(([x,i])=>row(x,i,F)).join("")}</details>`}).join("")}
function weekStrip(){const n=new Date(),m0=mon0(n),A=weekAhead(),t0=parseIso(S.t0);return`<section class="prg-card"><div class="prg-ch"><h2>This week</h2><small>${wkCount(0)} of ${S.days} done</small></div><div class="wkrow">${[...Array(7)].map((_,i)=>{const d=addD(m0,i),c=mid(d)-mid(n),h=S.h[iso(d)];let st,lab;
if(isFin(h)){st="done";lab=SH[h.w]||"Done"}
else if(c<0){st=d<t0?"pre":h&&h.s>0?"part":isTrain(d)?"past":"rest";lab=h&&h.s>0?SH[h.w]||"":st==="rest"?"Rest":"–"}
else if(c===0){const k=todayKey();st=k==="rest"?"rest":"plan";lab=k==="rest"?"Rest":SH[k]||""}
else{const k=A[iso(d)];st=k==="rest"?"rest":"plan";lab=k==="rest"?"Rest":SH[k]||""}
const say={done:"done",part:"started",past:"not done",pre:"before you started",rest:"rest day",plan:"planned"}[st];
return`<div class="wd ${st}${i===dow(n)?" now":""}" role="img" aria-label="${DN[i]}, ${say}${lab&&lab!=="–"?": "+lab:""}"><span class="dn">${"MTWTFSS"[i]}</span><span class="dc">${st==="done"?ic("chk",14,3.4):st==="part"?'<i class="hf"></i>':""}</span><span class="dl">${lab}</span></div>`}).join("")}</div></section>`}
const ringH=(v,t,inner,lab)=>{const C=2*Math.PI*34;return`<div class="ringw" role="img" aria-label="${lab}"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="rg-b" cx="40" cy="40" r="34"/><circle class="rg-f" cx="40" cy="40" r="34" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-(t?Math.min(1,v/t):0))}" transform="rotate(-90 40 40)"/></svg><b>${inner}</b></div>`};
const kpis=(a,cap,cl)=>`<div class="prg-30"><p class="prg-kh">${cap}</p><div class="prg-kpis${cl||""}">${a.map(([n,l])=>`<div><b>${n}</b><span>${l}</span></div>`).join("")}</div></div>`;
function heroK(k,now){const late=lateDay(now);if(S.ov[iso(now)]&&S.ov[iso(now)]!==nextKey())return"Your pick";return late?"Moved from "+DN[dow(late)]:"Today’s workout"}
function vToday(){const now=new Date(),t=iso(now),h=S.h[t],F=plan(),fin=isFin(h)&&S.more!==t,wk=wkCount(0),gl=S.days;let hero,list="";
const head=`${topBar()}<div class="tdy-h"><h1 class="prg-h">Today</h1><span class="tdy-date">${now.toLocaleDateString("en",{weekday:"long",day:"numeric",month:"long"})}</span></div>`,
top=(r,k,nm,ds)=>`<div class="prg-top">${r}<div class="prg-sk"><span class="hero-k">${k}</span><h2 class="hero-name">${nm}</h2><span class="hero-desc">${ds}</span></div></div>`;
if(!F){const nx=nextTrainDay();
hero=`<section class="hero prg-hero">${top(ringH(wk,gl,wk+"/"+gl,wk+" of "+gl+" workouts done this week"),"Recovery","Rest day","Muscles grow while you rest. "+wk+" of "+gl+" workouts done this week.")}${nx?kpis([[nx.label,"next session"],[pname(nextKey()),"workout"]],"Coming up"," two"):""}<div class="hero-act"><button class="cta g" data-a="anyway">Train anyway</button></div></section>`}
else if(!F.L.some(x=>x.b==="m")){hero=`<section class="hero prg-hero">${top(ringH(0,1,ic("lock",22,2.4),"No exercises available yet"),"Today’s workout",pname(F.k),"Your equipment doesn’t cover this workout yet. Add what you have, or pick a different workout.")}<div class="hero-act"><button class="cta go" data-a="settings">Edit equipment</button><button class="cta g alt1" data-a="pick">Change workout</button></div></section>`}
else{const L=F.L,k=F.k,M=mins(L),n=L.filter(x=>x.b==="m").length,d=L.filter(x=>F.done[key(x)]).length,dc=L.filter(x=>F.done[key(x)]===1).length,nk=needKeys(L),ws=L.filter(x=>x.b==="m").reduce((a,x)=>a+x.s,0);
if(fin){const mm=(h&&h.m)||1;hero=`<section class="hero prg-hero is-done">${top(ringH(1,1,ic("chk",26,3),"Workout complete"),"Today’s workout","Done for today",pname((h&&h.w)||k)+" is complete. Rest up and eat well.")}${kpis([[mm,mm===1?"minute":"minutes"],[h.s,"sets"],[fmt(h.r),"reps"]],"What you did")}<div class="hero-act alt2"><button class="cta g" data-a="tab" data-v="stats">See progress</button><button class="cta g" data-a="pick">Do another</button></div></section>`}
else{const tl=["w","m","c"].map(b=>{const g=L.filter(x=>x.b===b);if(!g.length)return"";return`<div class="tl-p ${b}" style="flex:${g.reduce((a,x)=>a+sec(x),0)}">${g.map(x=>`<i class="${F.done[key(x)]===1?"on":""}" style="flex:${sec(x)}"></i>`).join("")}</div>`}).join(""),
lg=["w","m","c"].filter(b=>L.some(x=>x.b===b)).map(b=>`<span class="${b}"><i></i>${blname(b,k)} <b>${M[b]} min</b></span>`).join("");
hero=`<section class="hero prg-hero">${top(ringH(dc,L.length,dc+"/"+L.length,dc+" of "+L.length+" moves done"),heroK(k,now),pname(k),pdesc(k))}
<div class="tl" role="img" aria-label="${L.length} moves, ${dc} done">${tl}</div><div class="tl-l">${lg}</div>
${kpis([[M.tot,M.tot===1?"minute":"minutes"],[n,n===1?"exercise":"exercises"],[ws,ws===1?"set":"sets"]],"This session")}
<div class="hero-act"><p class="need">${nk.length?`<span>You’ll need</span>${nk.map(x=>`<em>${gname(x)}</em>`).join("")}`:`<span>No equipment needed</span>`}</p>
<button class="cta go" data-a="go">${ic("play",18)} ${d===L.length?"Do skipped moves":d?"Resume workout":"Start workout"}</button>${d===L.length?`<p class="resume">${L.filter(x=>F.done[key(x)]===2).length} skipped. Finish them for this workout to count.</p>`:d?`<p class="resume">${dc} of ${L.length} moves done${d>dc?", "+(d-dc)+" skipped":""}</p>`:""}
<button class="cta g alt1" data-a="pick">${ic("gear",17)} Change workout</button></div></section>`}
list=`<section class="prg-card ses"><div class="prg-ch"><h2>Today’s session</h2><small>${L.length} moves · ${M.tot} min</small></div>${blocks(F)}</section>`}
return`<div class="tdy">${head}${hero}${weekStrip()}${list}</div>`}

// ---------- Progress ----------
// W: finished workouts (same rule as the weekly goal) · A: days with any sets done (the calendar)
function vStats(){let W=0,A=0,St=0,R=0;for(let i=0;i<30;i++){const h=hday(i);if(isFin(h))W++;if(h.s){A++;St+=h.s;R+=h.r}}
if(!Object.keys(S.h).length)return`<div class="prg">${topBar()}<h1 class="prg-h">Progress</h1><div class="prg-empty"><div class="prg-ghost" aria-hidden="true">${"<i></i>".repeat(28)}</div><strong>No workouts yet</strong><p>Finish your first workout and your weekly goal, sets and reps will show up here.</p><button class="cta s" data-a="tab" data-v="today">Go to today’s workout</button></div></div>`;
let mxs=1;for(let i=0;i<30;i++)mxs=Math.max(mxs,hday(i).s);
let pl="<i class=\"pl\"></i>".repeat((dy(29).getDay()+6)%7);
for(let i=29;i>=0;i--){const h=hday(i),dt=dy(i);pl+=`<i class="${i===0?"now ":""}${h.s?"on l"+Math.min(3,Math.ceil(h.s/mxs*3)):isTrain(dt)?"":"rest"}"><span>${dt.getDate()===1?dt.toLocaleDateString("en",{month:"short"}):dt.getDate()}</span></i>`}
const TD=(new Date().getDay()+6)%7,wr=[...Array(7)].map((_,j)=>j<=TD?hday(TD-j).r:0),tw=wr.reduce((a,b)=>a+b,0),lw=wr.reduce((a,_,j)=>a+(j<=TD?hday(TD-j+7).r:0),0),dl=lw?Math.round((tw-lw)/lw*100):0,mx=Math.max(...wr,1);
const g=S.days,d=wkCount(0),C=2*Math.PI*34,left=g-d,wb=[3,2,1,0].map(o=>({n:wkCount(o),l:o===0?"This week":o===1?"Last week":o+" weeks ago"}));
return`<div class="prg">${topBar()}<h1 class="prg-h">Progress</h1>
<section class="prg-hero"><div class="prg-top"><div class="ringw"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="rg-b" cx="40" cy="40" r="34"/><circle class="rg-f" cx="40" cy="40" r="34" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-Math.min(1,d/g))}" transform="rotate(-90 40 40)"/></svg><b>${d}/${g}</b></div><div class="prg-sk"><b>${d>=g?"Goal reached":left+(left===1?" workout":" workouts")+" to go"}</b><span>${d>=g?"Anything extra is a bonus.":"to hit this week’s goal of "+g}</span></div></div>
<div class="wbars" role="img" aria-label="Workouts per week, last four weeks: ${wb.map(w=>w.n).join(", ")}">${wb.map(w=>`<div><span class="bar"><i style="height:${Math.max(w.n?10:3,Math.min(100,w.n/g*100))}%"></i></span><b>${w.n}</b><small>${w.l}</small></div>`).join("")}</div>
<div class="prg-30"><p class="prg-kh">Last 30 days</p><div class="prg-kpis"><div><b>${W}</b><span>${W===1?"workout":"workouts"}</span></div><div><b>${St}</b><span>sets</span></div><div><b>${fmt(R)}</b><span>reps</span></div></div></div></section>
<section class="prg-card"><div class="prg-ch"><h2>This week</h2><small>Daily reps</small></div>
<div class="prg-wtot"><b>${tw}</b><span>reps</span>${lw?`<em class="prg-dl ${dl>=0?"up":"dn"}">${dl>=0?"▲":"▼"} ${Math.abs(dl)}% vs last week</em>`:""}</div>
<div class="prg-wk" role="img" aria-label="Reps per day this week: ${wr.slice(0,TD+1).join(", ")}">${wr.map((r,j)=>`<div class="${j===TD?"t":j>TD?"f":""}"><span class="v">${r||""}</span><div class="bar"><i style="height:${r?Math.max(10,Math.round(r/mx*100)):0}%;animation-delay:${j*45}ms"></i></div><span class="d">${"MTWTFSS"[j]}</span></div>`).join("")}</div></section>
<section class="prg-card"><div class="prg-ch"><h2>Last 30 days</h2><small>${A} active ${A===1?"day":"days"}</small></div>
<div class="prg-dow" aria-hidden="true">${[..."MTWTFSS"].map(c=>`<span>${c}</span>`).join("")}</div>
<div class="prg-cal" role="img" aria-label="${A} active days in the last 30">${pl}</div>
<div class="prg-leg"><span><i class="r"></i>Rest day</span><span><i class="n"></i>Today</span><span class="sc">Fewer sets<i class="a"></i><i class="b"></i><i></i>More sets</span></div></section>
</div>`}

// ---------- Explore ----------
function xcard(e){const ok=av(e),on=S.mine.includes(e.id),tag=e.eq!=="bw"?(ok?ic("eq_"+e.eq,13,2.2)+gname(e.eq):ic("lock",12,2.5)+"Needs "+gname(need(e))):!ok&&need(e)?ic("lock",12,2.5)+"Needs "+gname(need(e)):e.hh?(ok?ic("home",12,2.3)+HHS[e.hh]:ic("lock",12,2.5)+"Needs "+gname(need(e))):"";
return`<div class="xc${ok?"":" lk"}"><button class="xo" data-a="open" data-v="${e.id}"><div class="xt${tag?" tg":""}">${fig(e)}${tag?`<span class="xtag">${tag}</span>`:""}</div><div class="xn">${e.name}</div><div class="xm">${e.m}</div></button><button class="xa${on?" on":""}" data-a="mine" data-v="${e.id}" aria-label="${on?"Remove "+e.name+" from":"Save "+e.name+" to"} My workout" aria-pressed="${on}"><span>${ic(on?"saved":"save",15,2.2)}</span></button></div>`}
function exrows(){const q=S.q.toLowerCase(),L=Object.values(E).filter(e=>(S.mu==="All"||e.m===S.mu)&&(!q||(e.name+e.m).toLowerCase().includes(q))),A=L.filter(av),H=L.filter(e=>!av(e)),G=A.filter(e=>e.eq!=="bw"),B=A.filter(e=>e.eq==="bw"),grid=l=>`<div class="xg">${l.map(xcard).join("")}</div>`,sec_=(t,n)=>`<div class="prg-ch xsh"><h2>${t}</h2><small>${n} ${n===1?"exercise":"exercises"}</small></div>`;
let h="";
if(G.length){h+=sec_("Using your equipment",G.length)+grid(G);if(B.length)h+=sec_("Bodyweight",B.length)+grid(B)}
else if(B.length)h+=sec_("Bodyweight",B.length)+grid(B);
else h+=`<div class="em"><strong>${q&&H.length?"Nothing with your current equipment":"No exercises match"}</strong><p class="mu">${q&&H.length?"These need other equipment, shown below.":"Try another muscle group or clear your filters."}</p>${q&&H.length?"":'<button class="cta g s" data-a="clr">Clear filters</button>'}</div>`;
if(H.length&&q)h+=sec_("Needs other equipment",H.length)+grid(H);
return h}
// My workout: exercises saved from Explore, with a one-tap way to make it today's workout
function myCard(){const n=S.mine.length;
if(!n)return`<section class="prg-card"><div class="prg-ch"><h2>My workout</h2><small>Empty</small></div><p class="hint" style="margin:8px 0 0">Tap <span style="display:inline-block;vertical-align:-2px">${ic("save",15,2.2)}</span> on any exercise below to save it here, then do your own workout on any day.</p></section>`;
const b=build("mine",new Date(),S.len),c=b.L.filter(x=>x.b==="m").length,m=mins(b.L).tot,on=todayKey()==="mine";
return`<section class="prg-card"><div class="prg-ch"><h2>My workout</h2><small>${n} saved</small></div><div class="pv">${S.mine.map(id=>`<button class="th" data-a="open" data-v="${id}" aria-label="${E[id].name}">${fig(E[id])}</button>`).join("")}</div>${c?`<button class="cta s" data-a="domine" style="width:100%">${on?"Go to today’s workout":`${ic("play",16)} Do it today · about ${m} min`}</button>`:`<p class="hint" style="margin:0">These need equipment you haven’t turned on.</p>`}</section>`}
function vLibrary(){const all=Object.values(E),base=all.filter(av),tot=all.length,n=base.length,nb=base.filter(e=>e.eq==="bw").length,chips=MU.map(m=>{const c=m==="All"?base.length:base.filter(e=>e.m===m).length;return`<button class="chip ${S.mu===m?"on":""}" data-a="mu" data-v="${m}" aria-pressed="${S.mu===m}">${m}<b>${c}</b></button>`}).join(""),
gear=BASE.filter(b=>S.gear[b[0]]);
return`${topBar()}<h1 class="prg-h">Explore</h1>
<section class="prg-hero xhero"><div class="prg-top">${ringH(n,tot,Math.round(n/tot*100)+"%",n+" of "+tot+" exercises match your equipment")}<div class="prg-sk"><b>${n} of ${tot}</b><span>exercises match your equipment</span></div></div>
<div class="eqp">${gear.length?gear.map(b=>`<span class="eqt">${ic(IC["eq_"+b[0]]?"eq_"+b[0]:"home",14,2.2)}${b[2]}</span>`).join(""):'<span class="eqt">No equipment selected</span>'}<button class="eqt ed" data-a="settings">Edit</button></div>
<div class="prg-30"><p class="prg-kh">Your library</p><div class="prg-kpis"><div><b>${nb}</b><span>bodyweight</span></div><div><b>${n-nb}</b><span>with equipment</span></div><div><b>${S.mine.length}</b><span>in My workout</span></div></div></div></section>
${myCard()}
<div class="xs"><label class="srch">${ic("srch",18)}<input id="q" type="search" placeholder="Search exercises" value="${S.q.replace(/&/g,"&amp;").replace(/"/g,"&quot;")}" aria-label="Search exercises"></label><div class="chips">${chips}</div></div>
<div id="exl">${exrows()}</div>
<div class="xf"><svg class="mk" style="width:20px;opacity:.4;margin-top:12px" viewBox="0 0 471 488" aria-hidden="true"><use href="#ff-mark"/></svg><p class="lbl" style="opacity:.5">Fitforg · Works offline</p></div>`}
function render(){const m=$("#main"),y=m.scrollTop;nav();m.innerHTML={today:vToday,stats:vStats,library:vLibrary}[S.tab]();still();m.scrollTop=y}

// ---------- sheets and exercise detail ----------
function sheet(h,b,f){const s=document.createElement("div");s.className="sheet";s.innerHTML=`<div class="sh"><button class="x" data-a="close" aria-label="Close">${ic("x")}</button>${h}</div><div class="sb">${b}</div>${f?`<div class="foot">${f}</div>`:""}`;$("#app").append(s);still();vid(s);return s}
const lrow=(x,l)=>`<button class="row" data-a="open2" data-v="${x.id}"><div class="th">${fig(x)}</div><div class="t"><strong>${x.name}</strong><span class="m">${l}</span></div></button>`;
function open_(id,ix){const e=E[id],ok=av(e),mine=S.mine.includes(id),ch=CHAINS.find(c=>c.includes(id)),ci=ch?ch.indexOf(id):-1,ez=ch&&ci>0?E[ch[ci-1]]:null,hr=ch&&ci<ch.length-1?E[ch[ci+1]]:null,al=e.alt&&E[e.alt]&&E[e.alt]!==ez?E[e.alt]:null,nd=need(e),x=ix!=null&&S.fz?S.fz.L[ix]:null,pe=x?{s:x.s,r:x.r,rs:x.rs}:{s:e.s,r:e.r,rs:e.rs};
const s=sheet(`<span class="lbl">${e.m}</span>`,`${demo(e)}
<h1>${e.name}</h1><div class="chips2"><b>${pe.s} ${x&&x.sd?"sides":pe.s===1?"set":"sets"}</b><b>${rp(pe.r)}${x&&x.sd?" each":""}</b>${x&&x.b!=="m"?"":`<b>${pe.rs}s rest</b>`}<b>${gname(e.eq)}</b>${e.hh?`<b>${ic("home",13,2.3)} ${HHS[e.hh]}</b>`:""}</div>
${e.hh&&ok?`<div class="note"><b>You’ll need ${HHL[e.hh]}.</b> Check it’s stable before you start.</div>`:""}
${ok?"":`<div class="note"><b>Needs ${gname(nd)}.</b> ${al&&av(al)?"Your workouts use "+al.name+" instead.":"Turn it on in Settings to include it."}</div><button class="cta g s" data-a="own" data-v="${nd}" style="margin:-4px 0 14px">I have ${gname(nd).toLowerCase()}</button>`}
<h2>How to do it</h2><ol class="st">${e.st.map((t,i)=>`<li><span class="n">${i+1}</span><span>${t}</span></li>`).join("")}</ol>
<div class="note"><b>Form tip.</b> ${e.tp}</div>${fc(e)}
${ez||hr||al?`<h2 style="margin:6px 0 12px">Other versions</h2>${ez?lrow(ez,"Easier"):""}${hr?lrow(hr,"Harder"):""}${al?lrow(al,e.eq==="bw"?"Alternative":"No-gear alternative"):""}`:""}`,
ix!=null?`<button class="cta" data-a="swapx" data-v="${ix}">${ic("swap",18)} Swap this exercise</button>`:`<button class="cta" data-a="mine2" data-v="${id}">${mine?"Remove from My workout":"Save to My workout"}</button>`);s.dataset.id=id}
function ask(html){const m=document.createElement("div");m.className="mask";m.innerHTML=`<div class="modal" role="dialog">${html}</div>`;$("#app").append(m);m.onclick=e=>{if(e.target===m)m.remove()};return m}
const seg=(a,vals,cur,lab)=>`<div class="seg">${vals.map(v=>`<button class="${cur==v?"on":""}" data-a="${a}" data-v="${v}" aria-pressed="${cur==v}">${lab(v)}</button>`).join("")}</div>`;
const lenNote=()=>{const P=PH[S.len];return`${P.w} min warm-up + ${S.len-P.w-P.c} min workout + ${P.c} min cool-down. More time adds more exercises${S.len>=45?", then an extra set":""}.`};

// ---------- settings (also the first-run setup) ----------
function pill(a,k,on){return`<button class="eb ${on?"on":""}" data-a="${a}" data-v="${k}" role="switch" aria-checked="${on}">${ic(IC["eq_"+k]?"eq_"+k:"home",18,2)}${gname(k)}${on?ic("chk",14,3):""}</button>`}
function setBody(setup){const tot=Object.keys(E).length,n=Object.values(E).filter(av).length;
return`<h1 style="margin:4px 0 6px">${setup?"Set up your plan":"Settings"}</h1><p class="mu" style="margin-bottom:6px">${setup?"Tell Fitforg what you have. Every plan is built around it. You can change anything later in Settings, including furniture in your room.":"Plans update the moment you change something here."}</p>
<h2 class="sh2">Equipment you have<span>${n} of ${tot} exercises</span></h2><p class="mu" style="font-size:14px;margin:-4px 0 10px">Pick everything you can train with. Bodyweight means no kit at all. Plans only use what you pick.</p><div class="eq">${BASE.map(b=>pill("tg",b[0],!!S.gear[b[0]])).join("")}</div>
${setup?"":`<h2 class="sh2">Furniture in your room</h2><p class="mu" style="font-size:14px;margin:-4px 0 10px">Switch off anything you don’t have. Exercises that need it are dropped.</p><div class="eq">${HOME.map(h=>pill("th",h[0],S.home[h[0]]!==0)).join("")}</div>`}
<h2 class="sh2">Training days<span>per week</span></h2>${seg("sdays",[3,4,5,6],S.days,v=>v+" days")}<p class="hint">${SPLITD[S.days]}</p>
<h2 class="sh2">Session length</h2>${seg("slen",LENS,S.len,v=>v+" min")}<p class="hint">${lenNote()}</p>
${setup?"":`<h2 class="sh2">Notifications</h2>${notifySupported()?seg("ntg",["on","off"],ntOn()?"on":"off",v=>v==="on"?"On":"Off")+`<p class="hint">${ntHint()}</p>`:`<p class="mu" style="font-size:13.5px">This browser can’t show notifications.</p>`}`}
${setup?"":`<h2 class="sh2">App</h2>${window.__deferredPrompt?`<button class="cta" data-a="install">${ic("save",18,2.4)} Install Fitforg app</button><p class="mu" style="font-size:13.5px;margin-top:8px">Add Fitforg to your home screen for a full-screen, offline app experience.</p>`:`<p class="mu" style="font-size:13.5px">Open this page in Chrome on Android and tap the menu → “Install app” to add Fitforg to your home screen.</p>`}
<h2 class="sh2">Data</h2><button class="cta g s" data-a="rs">Reset progress</button><p class="mu" style="font-size:13.5px;margin-top:8px">Clears your history. Equipment and schedule stay.</p>`}`}
const ntHint=()=>notifyPermission()==="denied"?"Blocked on this phone. Allow notifications for Fitforg in your phone’s settings, then switch this on.":ntOn()?"When you switch apps during a rest, the countdown shows in your notifications and your phone buzzes when it’s time for the next set.":"Turn on to see the rest timer in your notifications when you switch to another app.";
function setupSheet(setup){const s=sheet("",setBody(setup),setup?`<button class="cta" data-a="eqdone">Build my plan</button>`:"");s.classList.add("set");if(setup)s.querySelector(".x").dataset.a="eqdone"}
function refSet(){const b=document.querySelector(".sheet.set .sb");if(b){const y=b.scrollTop;b.innerHTML=setBody(!!document.querySelector(".sheet.set .foot"));b.scrollTop=y}}

// ---------- change today's workout ----------
function pickH(){const cur=todayKey(),nk=nextKey(),n=new Date(),ord=[nk,...PORDER.filter(k=>k!==nk)];
const r=k=>{const b=build(k,n,S.len),m=mins(b.L),c=b.L.filter(x=>x.b==="m").length,no=k!=="mine"&&!canDo(k);return`<button class="pk ${cur===k?"on":""}${no?" lk":""}" data-a="${no?"":k==="mine"&&!S.mine.length?"goexp":"choose"}" data-v="${k}"><div><strong>${pname(k)}${nk===k?'<em class="bdg">Up next</em>':""}</strong><span>${pdesc(k)}</span><span class="pm">${no?"Needs more equipment":c?`About ${m.tot} min · ${c} ${c===1?"exercise":"exercises"}`:"Empty · add moves in Explore"}</span></div>${cur===k?ic("chk",20,3):""}</button>`};
return`<h2>Change today’s workout</h2><p class="mu" style="margin:-4px 0 10px">The workout you skip stays up next for tomorrow.</p><div class="lst"><p class="lbl2">Session length</p>${seg("plen",LENS,S.len,v=>v+" min")}<p class="hint" style="margin-bottom:14px">${lenNote()}</p><p class="lbl2">Workout</p>${ord.map(r).join("")}${r("mine")}</div><button class="cta s" data-a="close2" style="flex:none;width:100%">Done</button>`}
function pickSheet(){ask(pickH())}
function repick(){const m=document.querySelector(".mask .modal"),l=m&&m.querySelector(".lst"),y=l?l.scrollTop:0;if(m){m.innerHTML=pickH();m.querySelector(".lst").scrollTop=y}render()}

// ---------- swapping an exercise ----------
function alts(x){const e=x.e,out=[],seen={[x.id]:1},F=S.fz,inP=id=>F&&F.L.some(y=>y.id===id&&y.b===x.b),add=(id,l,val)=>{const a=E[id];if(!a||seen[id]||!(x.b==="m"?av(a):avw(a))||inP(id))return;seen[id]=1;out.push({e:a,l,val:val||""})};
if(x.b==="m"){const ch=CHAINS.find(c=>c.includes(x.id));if(ch){const i=ch.indexOf(x.id);if(i>0)add(ch[i-1],"Easier");if(i<ch.length-1)add(ch[i+1],"Harder")}
(SL[x.sl]||[]).forEach(id=>add(id,"Same muscles"));if(e.alt)add(e.alt,"Alternative");
if(out.length<3)Object.values(E).filter(a=>a.m===e.m&&a.m!=="Mobility"&&a.s>1).forEach(a=>{if(out.length<6)add(a.id,"Same muscle group")})}
else if(x.b==="w"){const tv=/s$/.test(x.r)?x.r:"60s";Object.values(WARM).forEach(W=>[...W.e.map(i=>i+":"+tv),...W.r.map(i=>i+":"+tv),...W.m].forEach(s=>{const[id,val]=s.split(":");add(id,"Warm-up option",val)}))}
else COOL.forEach(c=>add(c[0],"Stretch option",c[1]));
return out}
function swapAsk(i){const x=S.fz.L[i],A=alts(x);ask(`<h2>Swap ${x.e.name}</h2><p class="mu">Can’t do it, or the equipment is busy? Pick another way to train the same area.</p><div class="lst">${A.length?A.map(a=>`<button class="row" data-a="dosw" data-v="${i}|${a.e.id}|${a.val}"><div class="th">${fig(a.e)}</div><div class="t"><strong>${a.e.name}</strong><span class="m">${a.l}${a.e.eq!=="bw"?" · "+gname(a.e.eq):""}</span></div></button>`).join(""):'<p class="mu" style="padding:18px 0">No other options with your current equipment.</p>'}</div><button class="cta g" data-a="close2">Cancel</button>`);still()}

/* ================= Fitforg v2 · workout session and events ================= */
let ss=null,tm=null,th=null;
const topSheet=()=>[...document.querySelectorAll(".sheet")].pop();
function stop(){clearInterval(tm);clearInterval(th);ss=null;nsync();document.querySelectorAll(".sheet.run").forEach(s=>s.remove());render()}
function sv(){document.querySelector(".sheet.run")?.remove();const L=ss.L,x=L[ss.i],F=S.fz,e=x.e;let b,f="";
const hd=`<div class="segs">${L.map((y,j)=>`<i class="${y.b} ${F.done[key(y)]?"d":j===ss.i?"n":""}"></i>`).join("")}</div><span style="width:44px"></span>`;
if(ss.fin===2){b=`<div style="text-align:center;padding:36px 0 8px"><div class="okc big" style="background:var(--s2);color:#fff">${ic("skip",30,2.6)}</div><div class="big" style="font-size:36px">Not counted</div><p class="mu" style="margin:12px auto 0;max-width:30ch;font-size:16px">Most of ${pname(F.k)} was skipped, so it doesn’t count toward your week. Do at least half of the exercises for a workout to count.</p></div>`,f=`<button class="cta" data-a="stop">Back to Today</button>`}
else if(ss.fin){const h=S.h[iso(new Date())]||{};b=`<div style="text-align:center;padding:36px 0 8px"><div class="okc big">${ic("chk",34,3)}</div><div class="big" style="font-size:40px">Workout complete</div><p class="mu" style="margin-top:10px;font-size:17px">${pname(F.k)}</p></div><div class="stats" style="margin-top:26px"><div class="stat"><b>${Math.max(1,Math.round((Date.now()-ss.t0)/60000))}</b><span>min</span></div><div class="stat"><b>${ss.sets}</b><span>sets</span></div><div class="stat"><b>${ss.reps}</b><span>reps</span></div></div><p style="text-align:center;margin-top:18px"><span class="pill">${wkCount(0)} of ${S.days} this week</span></p>`,f=`<button class="cta g" data-a="toprog">See progress</button><button class="cta" data-a="stop">Back to Today</button>`}
else if(ss.rest){const C2=2*Math.PI*80,lab=x.sd?(ss.set===1?"Left side":"Right side"):"Set "+ss.set+" of "+x.s;b=`<div style="text-align:center;padding-top:20px"><p class="lbl">${ss.tr?"Warm-up done":ss.max<=10?"Get ready":"Rest"}</p><div style="position:relative;width:180px;height:180px;margin:18px auto"><div class="rest-extra" id="restExtra"></div><svg width="180" height="180" style="transform:rotate(-90deg)"><circle cx="90" cy="90" r="80" fill="none" stroke="#1e1e1e" stroke-width="8"/><circle class="rt-c" cx="90" cy="90" r="80" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C2}" stroke-dashoffset="${C2*(1-ss.rest/ss.max)}"/></svg><div class="big rt-n" style="position:absolute;inset:0;display:grid;place-items:center;font-family:var(--lb);font-size:48px">${ss.rest}</div></div><div style="display:flex;gap:10px;justify-content:center">${ss.max<=10?"":`<button class="cta g s" data-a="p15">+15s</button>`}<button class="cta g s skip-soft" data-a="skip">${ss.max<=10||ss.tr?"Start now":"Skip rest"}</button></div>${ss.tr?`<p class="hintc">${trHint(e)}</p>`:""}</div><div class="rest-card-glow" style="margin:20px 0 0;padding:16px;background:var(--s1);border:1px solid var(--ln);border-radius:20px"><p class="lbl" style="margin:0 0 10px">Up next · ${blname(x.b,F.k)}</p><div style="display:flex;align-items:center;gap:14px"><div style="width:100px;height:100px;flex:none;background:var(--s2);border-radius:14px;padding:6px;box-shadow:0 0 12px rgba(255,255,255,.08)">${fig(e)}</div><div><strong style="font-size:17px;display:block;margin-bottom:4px">${e.name}</strong><span class="m" style="font-size:14px">${lab} · ${rp(x.r)}${x.sd?" each":""}</span></div></div></div>`}
else{const timed=/s$/.test(x.r),n=parseInt(x.r),first=ss.i===L.findIndex(y=>y.b==="m"),lab=x.sd?(ss.set===1?"Left side":"Right side"):"Set "+ss.set+" of "+x.s,pos=L.filter(y=>y.b===x.b),pi=pos.indexOf(x)+1,left=ss.hold?Math.max(0,Math.ceil((ss.hold.end-Date.now())/1000)):n;
b=`${demo(e,' style="margin-top:0;aspect-ratio:auto;height:clamp(240px,38vh,340px);padding-bottom:62px!important"')}<div style="text-align:center"><p class="phl ${x.b}"><i></i>${blname(x.b,F.k)} · ${pi} of ${pos.length}</p><h1 style="font-size:30px">${e.name}</h1><div class="big" style="margin:14px 0 4px"><span class="hv">${left}</span><span class="mu" style="font-size:20px;letter-spacing:0"> ${timed?"sec":"reps"}${x.sd&&!timed?" each":""}</span></div><div class="dots" aria-label="${lab}">${[...Array(x.s)].map((_,j)=>`<i class="${j<ss.set-1?"d":j===ss.set-1?"c":""}"></i>`).join("")}</div><p class="mu">${lab}${x.sd&&timed?" · "+n+" sec each side":""}</p>${first&&ss.set===1&&x.b==="m"&&!ss.hold?'<p class="hintc">Take this first set a little easier to groove the movement.</p>':""}</div><div class="ssw"><button class="ghost" data-a="swapx" data-v="${ss.i}">${ic("swap",15)} Swap exercise</button><button class="ghost" data-a="skipx">${ic("skip",15)} Skip</button></div><details${ss.set===1?" open":""}><summary>How to do it</summary><ol class="st">${e.st.map((t,i)=>`<li><span class="n">${i+1}</span><span>${t}</span></li>`).join("")}</ol>${fc(e)}</details>`;
f=timed?(ss.hold?`<button class="cta g" data-a="holdx">Cancel</button><button class="cta" data-a="cs">${ic("chk",22,3)} Done</button>`:`<button class="cta" data-a="hold">${ic("clock",20)} Start ${n}s timer</button>`):`<button class="cta" data-a="cs">${ic("chk",22,3)} Complete set</button>`}
const sh=sheet(hd,b,f);sh.classList.add("run");sh.querySelector(".x").dataset.a="quit";nsync()}
// what to do in the break between the warm-up and the first work set
const trHint=e=>{const nd=e.eq!=="bw"?"your "+gname(e.eq).toLowerCase():e.hh?HHL[e.hh]:"";return"Catch your breath"+(nd?", then set up "+nd+".":" and have a sip of water.")};
function rest(sec,tr){ss.p15count=0;ss.tr=tr?1:0;if(!sec){sv();return}ss.rest=ss.max=sec;ss.end=Date.now()+sec*1000;sv();clearInterval(tm);tm=setInterval(()=>{if(!ss)return clearInterval(tm);ss.rest=Math.max(0,Math.ceil((ss.end-Date.now())/1000));const el=document.querySelector(".rt-n");if(el)el.textContent=ss.rest;const circ=document.querySelector(".rt-c");if(circ){const C=2*Math.PI*80;circ.setAttribute("stroke-dashoffset",C*(1-ss.rest/ss.max))}if(ss.rest<=0){clearInterval(tm);ss.rest=0;try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}sv()}},500)}
function startHold(){const x=ss.L[ss.i];ss.hold={end:Date.now()+parseInt(x.r)*1000};clearInterval(th);th=setInterval(()=>{if(!ss||!ss.hold)return clearInterval(th);const r=Math.max(0,Math.ceil((ss.hold.end-Date.now())/1000)),el=document.querySelector(".hv");if(el)el.textContent=r;if(r<=0){clearInterval(th);try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}completeSet()}},250);sv()}
// keep the notification panel in step with the workout (it only shows while you're in another app)
const setLab=x=>x.sd?(ss.set===1?"Left side":"Right side"):"Set "+ss.set+" of "+x.s;
function nsync(){if(!ss||ss.fin){notifyState(null);return}const x=ss.L[ss.i],e=x.e,lab=setLab(x)+" · "+rp(x.r)+(x.sd?" each":"");
if(ss.rest>0&&ss.max>10)notifyState({kind:ss.tr?"trans":"rest",end:ss.end,name:e.name,label:lab,p15:Math.max(0,3-ss.p15count)});
else if(ss.hold)notifyState({kind:"hold",end:ss.hold.end,name:e.name,label:setLab(x)});
else notifyState({kind:"idle",name:e.name,label:lab})}
function skipRest(){if(!ss||!ss.rest)return;clearInterval(tm);ss.rest=0;sv()}
function addRest(){if(!ss||!ss.rest)return;if(ss.p15count>=3){toast("Stop resting, start grinding. You got this.");return}ss.p15count++;ss.rest+=15;ss.max+=15;ss.end+=15000;const el=document.querySelector(".rt-n");if(el)el.textContent=ss.rest;const circ=document.querySelector(".rt-c");if(circ){const C=2*Math.PI*80;circ.setAttribute("stroke-dashoffset",C*(1-ss.rest/ss.max))}const eb=document.getElementById("restExtra");if(eb){eb.textContent="+"+(ss.p15count*15)+"s";eb.classList.add("show")}toast(["Good to go.","One last breather.","That’s all the rest you need."][ss.p15count-1]||"");nsync()}
// the buttons on the notification do the same as the ones on screen
notifyOn("skip",skipRest);notifyOn("add15",addRest);
// the first time you start a workout, offer the rest timer in the notification panel
function askNotify(){if(S.nt!=null||notifyPermission()!=="default")return;
ask(`<h2>Keep the rest timer with you</h2><p class="mu">Switch to another app while you rest and Fitforg shows the countdown in your notifications, then tells you when it’s time for the next set.</p><button class="cta" data-a="nton">Turn on notifications</button><button class="cta g" data-a="ntno">Not now</button>`)}
async function ntTurnOn(){const p=notifyPermission();
if(p==="unsupported"){toast("This browser can’t show notifications");return}
if(p==="denied"){S.nt=0;save();refSet();toast("Notifications are blocked. Allow them for Fitforg in your phone’s settings");return}
const r=p==="granted"?p:await notifyAsk();S.nt=r==="granted"?1:0;save();refSet();toast(r==="granted"?"Rest timer notifications are on":"Notifications stay off. You can change this in Settings")}
// minutes spent in this run go into today's history (also when a workout is ended early)
function logMin(){if(!ss||!ss.act)return;const h=S.h[iso(new Date())];if(h)h.m=(h.m||0)+Math.max(1,Math.round((Date.now()-ss.t0)/60000));ss.act=0}
// a workout only counts when at least half of its exercises were done, not skipped
function finishSession(){clearInterval(th);ss.hold=null;const F=S.fz,fk=F.k,mm=ss.L.filter(y=>y.b==="m"),dn=mm.filter(y=>F.done[key(y)]===1).length;logMin();
if(dn>0&&dn*2>=mm.length){const t=iso(new Date()),h=S.h[t]=S.h[t]||{s:0,r:0,fin:0};ss.fin=1;h.fin=1;h.w=fk;if(fk===nextKey())S.n+=offFrom(S.n)+1;S.vc[fk]=(S.vc[fk]||0)+1;S.more=null}
else ss.fin=2;
save();sv()}
function nextItem(){const F=S.fz,n=ss.L.findIndex(y=>!F.done[key(y)]);return n}
function completeSet(){clearInterval(th);ss.hold=null;const x=ss.L[ss.i],F=S.fz,t=iso(new Date()),h=S.h[t]=S.h[t]||{s:0,r:0,fin:0};
if(x.b==="m"){const n_=/s$/.test(x.r)?0:(parseInt(x.r)||0)*(x.sd?2:1);h.s++;h.r+=n_;ss.sets++;ss.reps+=n_}
ss.act=1;F.sd[key(x)]=ss.set;
if(ss.set<x.s){ss.set++;save();rest(x.rs)}else{F.done[key(x)]=1;const n=nextItem();if(n<0){finishSession()}else{const tr=x.b==="w"&&ss.L[n].b==="m";ss.i=n;ss.set=firstSet(n);save();rest(tr?TRANS:x.rs,tr)}}}
// the set to start a move on: the one after the last set already done
const firstSet=i=>{const x=ss.L[i];return Math.min(x.s,(S.fz.sd[key(x)]||0)+1)};
function skipEx(){clearInterval(th);ss.hold=null;const x=ss.L[ss.i],F=S.fz;F.done[key(x)]=2;const n=nextItem();if(n<0)finishSession();else{ss.i=n;ss.set=firstSet(n);save();sv()}}
const EQLATER="Today’s session is already started. This change applies from your next workout";
const closeMask=()=>document.querySelector(".mask")?.remove();
const dayWord=d=>iso(d)===iso(new Date())?"today":DN[dow(d)];

document.addEventListener("input",e=>{if(e.target.id==="q"){S.q=e.target.value;$("#exl").innerHTML=exrows();still()}});
$("#app").onclick=ev=>{const b=ev.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,v=b.dataset.v;
if(a==="tab"){S.tab=v;save();document.querySelectorAll(".sheet:not(.run)").forEach(s=>s.remove());render();$("#main").scrollTop=0}
else if(a==="mu"){S.mu=v;render()}else if(a==="clr"){S.q="";S.mu="All";render()}
else if(a==="own"){const id=document.querySelector(".sheet")?.dataset.id;if(BASE.some(g=>g[0]===v))S.gear[v]=1;else S.home[v]=1;const ok=invalidate();save();document.querySelector(".sheet")?.remove();render();if(id)open_(id);toast(gname(v)+" turned on"+(ok?"":". Today’s started session stays as it is"))}
else if(a==="toprog"){stop();S.tab="stats";render();$("#main").scrollTop=0}
else if(a==="goexp"){closeMask();S.tab="library";render();$("#main").scrollTop=0}
else if(a==="settings"){setupSheet(false)}
else if(a==="install"){if(window.__deferredPrompt){window.__deferredPrompt.prompt();window.__deferredPrompt.userChoice.then(r=>{if(r.outcome==="accepted")toast("Installing Fitforg…");window.__deferredPrompt=null;refSet()})}else toast("Use Chrome → menu → Install app")}
else if(a==="tg"){if(S.gear[v]&&BASE.filter(g=>S.gear[g[0]]).length<2){toast("Keep at least one on");return}S.gear[v]=S.gear[v]?0:1;const ok=invalidate();save();refSet();render();if(!ok)toast(EQLATER)}
else if(a==="th"){S.home[v]=S.home[v]===0?1:0;const ok=invalidate();save();refSet();render();if(!ok)toast(EQLATER)}
else if(a==="sdays"){const nv=+v;if(nv===S.days)return;const t=iso(new Date()),F=S.fz,go_=F&&F.d===t&&started(F)&&!doneOn(new Date());
S.days=nv;S.sch=S.sch.filter(x=>x.f!==t);S.sch.push({f:t,d:nv});S.n=queueAfter();
// a session you've already started stays as today's workout
if(go_){S.ov={[t]:F.k};const i=cyc().indexOf(F.k);if(i>=0)S.n=i}else invalidate();
save();refSet();render();toast(go_?"Schedule changed. Today’s started workout stays":"Schedule changed. "+pname(nextKey())+" is up next")}
else if(a==="slen"){S.len=+v;const ok=invalidate();save();refSet();render();if(!ok)toast("Today’s session is already started. The new length starts next workout")}
else if(a==="eqdone"){if(!BASE.some(g=>S.gear[g[0]])){toast("Pick at least one option");return}S.eqSet=1;save();document.querySelector(".sheet.set")?.remove();render()}
else if(a==="quit"){if(ss&&ss.fin)stop();else ask(`<h2>End workout?</h2><p class="mu">Finished sets are saved. You can resume from Today.</p><button class="cta" data-a="close2">Keep going</button><button class="cta g" data-a="stop2">End workout</button>`)}
else if(a==="stop2"){closeMask();logMin();save();stop()}
else if(a==="open"||a==="open2"){if(a==="open2")topSheet()?.remove();open_(v)}
else if(a==="openx"){open_(S.fz.L[+v].id,+v)}
else if(a==="close"){const s=topSheet();s&&!s.classList.contains("run")&&s.remove();render()}
else if(a==="mine"){const i=S.mine.indexOf(v);i<0?S.mine.push(v):S.mine.splice(i,1);save();render();toast(i<0?"Saved to My workout":"Removed from My workout")}
else if(a==="mine2"){const i=S.mine.indexOf(v);i<0?S.mine.push(v):S.mine.splice(i,1);save();b.textContent=i<0?"Remove from My workout":"Save to My workout";toast(i<0?"Saved to My workout":"Removed from My workout")}
else if(a==="domine"){if(todayKey()!=="mine"){choose(new Date(),"mine");toast("My workout is today’s workout. "+pname(nextKey())+" stays up next")}S.tab="today";save();document.querySelectorAll(".sheet:not(.run)").forEach(s=>s.remove());render();$("#main").scrollTop=0}
else if(a==="pick"){closeMask();pickSheet()}
else if(a==="plen"){S.len=+v;const ok=invalidate();save();repick();if(!ok)toast("Today’s session is already started. The new length starts next workout")}
else if(a==="choose"){choose(new Date(),v);closeMask();render();$("#main").scrollTop=0;toast(pname(v)+" is today’s workout"+(v!==nextKey()?". "+pname(nextKey())+" stays up next":""))}
else if(a==="anyway"){choose(new Date(),nextKey());render();$("#main").scrollTop=0}
else if(a==="swap"){swapAsk(+v)}
else if(a==="swapx"){const s=b.closest(".sheet");if(s&&!s.classList.contains("run"))s.remove();swapAsk(+v)}
else if(a==="dosw"){const[i,id,val]=v.split("|"),F=S.fz,old=F.L[+i],nx=mk(id,old.b,{sl:old.sl,val:val||undefined});F.L[+i]=nx;save();closeMask();if(ss){clearInterval(th);ss.hold=null;ss.set=1;sv()}else render();toast("Swapped to "+E[id].name)}
else if(a==="skipx"){skipEx()}
else if(a==="go"){const F=plan();if(!F)return;
// everything marked but the workout didn't count: reopen only the skipped moves
if(F.L.every(x=>F.done[key(x)]))F.L.forEach(x=>{if(F.done[key(x)]===2)delete F.done[key(x)]});
if(F.L.every(x=>F.done[key(x)])){F.done={};F.sd={}}
ss={L:F.L,i:F.L.findIndex(x=>!F.done[key(x)]),set:1,rest:0,fin:0,p15count:0,t0:Date.now(),sets:0,reps:0,hold:null,act:0};ss.set=firstSet(ss.i);save();sv();askNotify()}
else if(a==="cs"){completeSet()}
else if(a==="hold"){startHold()}
else if(a==="holdx"){clearInterval(th);ss.hold=null;sv()}
else if(a==="skip"){skipRest()}
else if(a==="p15"){addRest()}
else if(a==="stop")stop();
else if(a==="rs"){ask(`<h2>Reset progress?</h2><p class="mu">This clears your workout history and today’s session. Equipment and schedule stay. This can’t be undone.</p><button class="cta" data-a="rs2">Yes, reset</button><button class="cta g" data-a="close2">Cancel</button>`)}
else if(a==="rs2"){S.h={};S.fz=null;S.ov={};S.n=0;S.vc={};S.more=null;S.t0=iso(new Date());save();closeMask();render();toast("Progress reset")}
else if(a==="nton"){closeMask();ntTurnOn()}
else if(a==="ntno"){closeMask();S.nt=0;save();toast("You can turn notifications on later in Settings")}
else if(a==="ntg"){if(v==="on")ntTurnOn();else{S.nt=0;save();refSet()}}
else if(a==="close2")closeMask()};
render();


// ----- Splash screen controller -----
;(function(){
const sp=document.getElementById("splash"),go=document.getElementById("sp-go"),lock=["main","nav"].map(i=>document.getElementById(i));
const rd=()=>{try{if(localStorage.getItem("ff_welcome")==="1")return 1}catch(e){}return /(?:^|; )ff_welcome=1/.test(document.cookie)?1:0};
const wr=()=>{try{localStorage.setItem("ff_welcome","1")}catch(e){}try{document.cookie="ff_welcome=1; max-age=315360000; path=/; SameSite=Lax"}catch(e){}};
let seen=rd();
try{if(!seen&&localStorage.getItem("ff3"))seen=1}catch(e){}   // data from the previous app version means they have used it before (ff4 is not checked: the app writes it while loading)
if(location.hash==="#welcome")seen=0;     // add #welcome to the address to preview the first-launch screen
lock.forEach(n=>n.inert=true);
let done=0;
function leave(){if(done)return;done=1;sp.classList.add("out");lock.forEach(n=>n.inert=false);setTimeout(function(){sp.remove();render();still();if(!S.eqSet)setTimeout(function(){setupSheet(true)},300)},450)}
if(seen){sp.classList.add("quick");sp.onclick=leave;setTimeout(leave,1200)}
else{wr();go.onclick=leave}
})();

// ----- PWA install prompt (WebAPK via beforeinstallprompt) -----
// Chrome Android fires this when the PWA meets installability criteria.
// We capture it so we can show our own "Install app" button in Settings,
// instead of relying on Chrome's auto mini-infobar.
window.__deferredPrompt=null;
window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();                 // stop Chrome's mini-infobar
  window.__deferredPrompt=e;          // save for our Settings button
});
window.addEventListener("appinstalled",()=>{
  window.__deferredPrompt=null;
  toast("Fitforg installed — find it in your apps");
});

// ----- Service worker (production only) -----
if("serviceWorker" in navigator && import.meta.env.PROD){navigator.serviceWorker.register("./sw.js").catch(function(){})}
