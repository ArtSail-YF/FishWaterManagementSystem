const fs = require('fs');
const file = process.argv[2];
let content = fs.readFileSync(file, 'utf8');

// Fix line 100: targetId template literal
content = content.replace(
  "{plan.targetId ? $" + "{plan.targetType || ''}- : '-'}",
  "{plan.targetId ? $" + "{plan.targetType || ''}-$" + "{plan.targetId} : '-'}"
);

// Fix line 102: startTime template literal
content = content.replace(
  "{plan.startTime ? $" + "{plan.startTime} ~  : '-'}",
  "{plan.startTime ? $" + "{plan.startTime} ~ $" + "{plan.endTime || ''} : '-'}"
);

fs.writeFileSync(file, content, 'utf8');
console.log('PublishPlanModal.tsx fixed');
