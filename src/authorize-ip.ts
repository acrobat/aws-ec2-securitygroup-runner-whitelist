import * as core from '@actions/core'
import { HttpClient } from '@actions/http-client';
import { IPResponse } from './types';
import { exec } from '@actions/exec';

(async () => {
    const sgId = core.getInput('securitygroup-id');

    // Get runner ip
    const maxRetries = 10;

    const http = new HttpClient('haythem/public-ip', undefined, { allowRetries: true, maxRetries: maxRetries });
    const ipv4 = await http.getJson<IPResponse>('https://api.ipify.org?format=json');

    core.info(`ipv4: ${ipv4.result.ip}`);
    core.saveState('ipv4', ipv4.result.ip);

    const ipv4Value = ipv4.result.ip;

    // Whitelist in aws
    await exec(`aws ec2 authorize-security-group-ingress --group-id ${{ sgId }} --protocol tcp --port 22 --cidr ${{ ipv4Value }}/32`);
})().catch(error => {
    core.setFailed(error);
});
