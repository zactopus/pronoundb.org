/*
 * Copyright (c) 2020-2021 Cynthia K. Rey, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import type { FastifyInstance } from 'fastify'
import type { ExternalAccount } from '@pronoundb/shared'

import fetch from 'node-fetch'
import register from './abstract/oauth2.js'
import config from '../config.js'

const [ clientId, clientSecret ] = config.oauth.github

async function getSelf (token: string): Promise<ExternalAccount> {
  const data = await fetch('https://api.github.com/user', {
    headers: {
      accept: 'application/vnd.github.v3+json',
      authorization: `token ${token}`,
    },
  }).then((r) => r.json() as any)

  return { id: data.id.toString(), name: data.name ? `${data.name} (${data.login})` : data.login, platform: 'github' }
}

export default async function (fastify: FastifyInstance) {
  register(fastify, {
    clientId: clientId,
    clientSecret: clientSecret,
    platform: 'github',
    authorization: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    scopes: [],
    getSelf: getSelf,
  })
}
