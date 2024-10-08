'use strict'

import { test } from "tap"
import app from "../src/server"

test('request para a rota "/suppliers" ', async t => {

  const response = await app.inject({
    method: 'GET',
    url: '/suppliers'
  })
  t.equal(response.statusCode, 200, 'returns a status code of 200')
})