import assert from 'node:assert/strict';
import test from 'node:test';
import handler from './src/index.mjs';

const origin = 'https://himanshu77raj.github.io';
function request(path, body, requestOrigin = origin) {
  return new Request(`https://example.workers.dev${path}`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
function environment(aiRun, allow = true) {
  return {
    AI: { run: aiRun },
    VISITOR_LIMIT: { limit: async () => ({ success: allow }) },
    SITE_LIMIT: { limit: async () => ({ success: allow }) }
  };
}

test('accepts a short open question and sends verified portfolio context to Llama', async () => {
  let model, payload;
  const env = environment(async (m, p) => { model = m; payload = p; return { response: 'A calm answer.' }; });
  const response = await handler.fetch(request('/chat', { question: 'What is recursion?' }), env);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).answer, 'A calm answer.');
  assert.match(model, /llama/);
  assert.match(payload.messages[0].content, /Rajesh Roshan Nanda/);
  assert.equal(payload.messages.at(-1).content, 'What is recursion?');
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
});

test('rejects unauthorized origins, oversized questions, and rate limited visitors', async () => {
  const env = environment(async () => { throw Error('AI must not run'); });
  assert.equal((await handler.fetch(request('/chat', { question: 'hello' }, 'https://other.example'), env)).status, 403);
  assert.equal((await handler.fetch(request('/chat', { question: 'x'.repeat(301) }), env)).status, 400);
  assert.equal((await handler.fetch(request('/chat', { question: 'hello' }), environment(() => {}, false))).status, 429);
});

test('returns MP3 stream for spoken replies', async () => {
  const bytes = Uint8Array.from([73, 68, 51]);
  let payload;
  const env = environment(async (_model, p) => { payload = p; return new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }); });
  const response = await handler.fetch(request('/speak', { text: 'Hello, Meera.' }), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'audio/mpeg');
  assert.equal(payload.speaker, 'luna');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});
