In Setup of SPA CI there are two pages that currently interest us

1 Tasks - Used to define steps that are to be made once the pipeline is triggered
2 Triggers - Definition of when the pipeline is to be triggered 

**TASKS**
![image.png](/.attachments/image-1876dd7a-fc30-489c-ab8c-ad437dc0392b.png)
First, in the setup, we need to define which branch to take code from.
After that, we define which steps for build to take, in this case, we used the following:

Npm Install - To install all necessary modules.

Npm Build - To create minified files fit for the deployment. (As this is a custom command, we need to define "run build" in the command section - Azure prefixes all npm commands with NPM by default)

Archive Files - Creates a zip file from a given path and stores it in a given location

Publish Artifacts - drops created zip file, saving it to be used by tasks outside of this pipeline

**TRIGGERS**
![image.png](/.attachments/image-e245f928-53e8-4b0b-b867-ce73f172368b.png)
Once we have defined which actions are to be taken once the pipeline is triggered, we need to set what triggers it.

As seen in the photo, continuous integration is enabled, which means that whenever chosen branch (in this case, main) has any code changes, this pipeline will be automatically triggered.