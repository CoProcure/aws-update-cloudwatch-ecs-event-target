# AWS Update Cloudwatch Event Target with Task Definition

Updates Task Definitions to the latest active version for all Cloudwatch Event Targets from a list of rule names.

This is useful for keeping scheduled tasks up-to-date with the latest deployed builds rather than managing separate
task definitions for each scheduled task.

Usage
``` yaml
- name: Update task definitions
  uses: coprocure.us/aws-update-cloudwatch-ecs-event-target@v1.0
  with:
    task-defintion-family: task-definition-name
    rules: |-
      rule-1
      rule-2
      rule-3
```

See [aciton.yml](action.yml) file for the full documentation for this action's inputs and outputs.

Note that this action retrieves and sets the latest task definition for a given task definition family. For each rule, all event targets will be updated.

## Credentials and Region

This action relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) to determine AWS credentials and region.
Use [the `aws-actions/configure-aws-credentials` action](https://github.com/aws-actions/configure-aws-credentials) to configure the GitHub Actions environment with environment variables containing AWS credentials and your desired region.

## License Summary

This code is made available under the MIT license.
