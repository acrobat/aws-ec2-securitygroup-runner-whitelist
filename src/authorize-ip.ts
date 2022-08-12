import * as core from '@actions/core'
import { HttpClient } from '@actions/http-client';
import { IPResponse } from './types';
import { exec } from '@actions/exec';

(async () => {
    const sgId = core.getInput('securitygroup-id');
    const maxRetries = 10;

    const http = new HttpClient('github action "acrobat/aws-ec2-allow-runner-ip"', undefined, { allowRetries: true, maxRetries: maxRetries });
    const ipv4 = await http.getJson<IPResponse>('https://api.ipify.org?format=json');

    core.info(`ipv4: ${ipv4.result.ip}`);
    core.saveState('ipv4', ipv4.result.ip);

    await exec('aws ec2 authorize-security-group-ingress --group-id ' + sgId + ' --protocol tcp --port 22 --cidr ' + ipv4.result.ip +'/32');
})().catch(error => {
    core.setFailed(error);
});
