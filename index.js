import fs from 'fs'
import * as R from 'ramda'

const data = fs.readFileSync('test.json', 'utf-8')

const array = data.split('{"messageType":"DATA_MESSAGE"').map(d => d.trim()).filter(d => d !== '').map(d => '{"messageType":"DATA_MESSAGE"' + d).map(d => JSON.parse(d))

const result = array.map(j => ({ logStream: j.logStream, logEvents: j.logEvents.map(e => e.message) }))

R.pipe(
  R.map(item => `${item.logStream}.log`.replace('/', '_')),
  R.uniq,
  R.forEach(filePath => fs.writeFileSync(filePath, ''))
)(result)

for(const item of result) {
  const filePath = `${item.logStream}.log`.replace('/', '_')
  fs.appendFileSync(filePath, item.logEvents.join('\n'))
}
