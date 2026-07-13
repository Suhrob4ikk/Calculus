// Загружает все *.json из этой папки в Supabase Storage bucket "question-bank",
// перезаписывая старые (рассинхронизированные) файлы.
//
// Зачем: submit-test (серверный подсчёт) генерирует вопросы ежедневки/дуэли из
// этого бакета. Если бакет расходится с клиентскими банками (js/*-questions.js),
// ежедневка считается 0/10 (у сервера другие 10 вопросов). Эти файлы собраны
// ровно из клиентских банков — см. регенерацию ниже.
//
// Запуск (из корня репозитория), ключ берётся из окружения — в код не попадает:
//   SUPABASE_SERVICE_KEY=<service_role key> node supabase/question-bank/upload.mjs
//   (в PowerShell: $env:SUPABASE_SERVICE_KEY="..."; node supabase/question-bank/upload.mjs)
//
// service_role key: Supabase Dashboard → Project Settings → API → service_role.
//
// Регенерация файлов из клиентских банков (если поменяются вопросы):
//   node --input-type=module -e "import {QUESTIONS} from './js/questions.js';import fs from 'fs';
//   const S=['integrals','derivatives','series','limits','ode','probability','linalg'],D=['easy','medium','hard'];
//   for(const s of S)for(const d of D){const a=(QUESTIONS[s]?.[d]||[]).map(q=>{const o={question:q.question,options:q.options,correct:q.correct??q.answerIndex,type:'choice'};if(q.open)o.open=q.open;if(q.explanation)o.explanation=q.explanation;return o});fs.writeFileSync('supabase/question-bank/'+s+'_'+d+'.json',JSON.stringify(a))}"

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PROJECT = 'xahjwhoywxgudsefqowd'
const BUCKET  = 'question-bank'
const KEY = process.env.SUPABASE_SERVICE_KEY
if (!KEY) {
  console.error('❌ Set SUPABASE_SERVICE_KEY (service_role key) in the environment first.')
  process.exit(1)
}

const here  = path.dirname(fileURLToPath(import.meta.url))
const files = fs.readdirSync(here).filter(f => f.endsWith('.json'))

let ok = 0, fail = 0
for (const f of files) {
  const body = fs.readFileSync(path.join(here, f))
  const res = await fetch(`https://${PROJECT}.supabase.co/storage/v1/object/${BUCKET}/${f}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'x-upsert': 'true' },
    body,
  })
  if (res.ok) { ok++; console.log('✓', f) }
  else { fail++; console.log('✗', f, res.status, (await res.text()).slice(0, 120)) }
}
console.log(`\nDone: ${ok} uploaded, ${fail} failed.`)
