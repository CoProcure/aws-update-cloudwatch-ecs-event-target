# Wait for ECS Deployment to Complete

Waits for any pending ECS deployment to reach the completed state before continuing. This action
is useful to avoid cases where a new deploy begins during a partially completed rollback. AWS notes
in their [documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-circuit-breaker.html)
that when using deployment circuit breakers, if a second deployment begins while the first is being
rolled back, the second deployment _cannot_ rollback.

Usage
``` yaml
- name: Wait for deployment
  uses: coprocure/wait-for-ecs-deployment@v1.0
  with:
    cluster: main
    service: my-service
```

See [action.yml](action.yml) file for the full documentation for this action's inputs and outputs.

## Credentials and Region

This action relies on the [default behavior of the AWS SDK for Javascript](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) to determine AWS credentials and region.
Use [the `aws-actions/configure-aws-credentials` action](https://github.com/aws-actions/configure-aws-credentials) to configure the GitHub Actions environment with environment variables containing AWS credentials and your desired region.

## License Summary

This code is made available under the MIT license.
