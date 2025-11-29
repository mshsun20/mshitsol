import { mailConfig } from "../../configs/mailConfig.js";
import { genPolicyUpdateMailnotif } from "../mailing/policyUpdateNotifTemplate.js";

export const sendPolicyUpdateMail = async (policy, subject) => {
    if (!policy.createdby) return;

    try {
        const htmlContent = await genPolicyUpdateMailnotif(policy);
        const mailResponse = await mailConfig([policy.createdby?.acc_eml], [], [], subject, htmlContent);
        if (mailResponse) {
            console.log(`📧 Mail sent to ${policy.createdby?.acc_eml} for policy ${policy.policyNo}`);
            return { message: `✅ Mail Notification Sent successfully.`, response: mailResponse };
        }
    } catch (err) {
        console.error(`Failed to send mail to ${policy.createdby?.acc_eml} for policy ${policy.policyNo}:`, err);
    }
};
