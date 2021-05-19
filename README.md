# MCU Server

socket -> server

- TempChanged
```javascript
const event = {
  type: 'TempChanged',
  data: {
    temp, // number
  },
}
```

server -> socket

- TempSetup
```javascript
const event = {
  type: 'TempSetup',
  data: {
    temp, // number
  },
}
```
- FanOn
```javascript
const event = {
  type: 'FanOn',
}
```
- FanOff
```javascript
const event = {
  type: 'FanOff',
}
```
- BulbOn
```javascript
const event = {
  type: 'BulbOn',
}
```
- BulbOff
```javascript
const event = {
  type: 'BulbOff',
}
```