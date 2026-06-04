// shared/domain/ResponseActionType.js

const ResponseActionType = Object.freeze({
  BLOCK_IP: 'BLOCK_IP',
  ISOLATE_ENDPOINT: 'ISOLATE_ENDPOINT',
  DISABLE_USER: 'DISABLE_USER',
  QUARANTINE_FILE: 'QUARANTINE_FILE',
  ESCALATE_TO_TIER3: 'ESCALATE_TO_TIER3'
});

module.exports = ResponseActionType;
