With the setup of CD, the following steps are of interest to us :

**TRIGGER**

On this page, we define triggers, among them being CD - Enabling CD means that whenever chosen branch has new build prepared (in this case, main), this CD will be automatically triggered.

**ARTIFACTS**


Here, we define the source for our artifacts. In this case, we wish to work with the archive that was already made by our SPA-CI.

**PRE-DEPLOYMENT APPROVALS**

Page, where we define if we wish to have this CD run automatically on its own, or approval, is needed. Currently, it is set that any Ekviti member can approve this CD, to avoid the cascade of errors if PR is approved by mistake.

**TASKS**

Finally, the definition of what is to be done, once CD is triggered.

In this case, we wish that the following actions are taken:

Extract Files - Extract artifacts on a given path

Upload Resources/CSS/JS/Media - Upload of extracted files to the remote machine, using FTP. (All steps are needed as our zip file contains folder structure, and currently, we have no means of unzipping files on the remote machine programmatically)