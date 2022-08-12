import * as core from '@actions/core'
import { exec } from '@actions/exec';

(async () => {
    const sgId = core.getInput('securitygroup-id');
    const ipv4 = core.getState('ipv4')

    await exec('aws ec2 revoke-security-group-ingress --group-id ' + sgId + ' --protocol tcp --port 22 --cidr ' + ipv4 +'/32');
})().catch(error => {
    core.setFailed(error);
});
