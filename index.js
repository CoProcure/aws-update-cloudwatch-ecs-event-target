const core = require("@actions/core");
const {
  ECSClient,
  RegisterTaskDefinitionCommand,
  DescribeServicesCommand,
  DescribeTasksCommand,
  DescribeTaskDefinitionCommand,
  RunTaskCommand,
  waitUntilTasksStopped
} = require("@aws-sdk/client-ecs");
const {
  CloudWatchEventsClient,
  ListTargetsByRuleCommand,
  PutTargetsCommand
} = require("@aws-sdk/client-cloudwatch-events");


const ecsClient = new ECSClient({});
const cloudwatchClient = new CloudWatchEventsClient({});

async function fetchTaskDefinitionArn(taskDefinition) {
  try {
    core.debug(`Getting ${taskDefinition}'s latest task definition.`)
    const response = await ecsClient.send(new DescribeTaskDefinitionCommand({ taskDefinition }))
    if (!response || !response.taskDefinition) throw new Error(`${taskDefinition} not found.`)
      const taskDefArn = response.taskDefinition.taskDefinitionArn;
      core.setOutput('task-definition-arn', taskDefArn);
      return taskDefArn
  } catch (error) {
    core.setFailed(error.message)
    throw(error)
  }
}

function parseTargets(targetsStr) {
  return targetsStr.split(/\r|\n/).map((target) => target.trim())
}

async function run() {
  const taskDefinitionFamily = core.getInput('task-definition-family', { required: true });
  const rules = parseTargets(core.getInput('rule-names', { required: true }));
  const taskDefinitionArn = await fetchTaskDefinitionArn(taskDefinitionFamily);

  core.debug(`Updating targets with ${taskDefinitionArn}.`)
  for (const rule of rules) {
    const listTargetCommand = new ListTargetsByRuleCommand({ Rule: rule });

    let targets;
    try {
      core.debug(`Retrieving targets for ${rule}.`);
      const response = await cloudwatchClient.send(listTargetCommand);
      targets = response.Targets.map((target) => ({ ...target, EcsParameters: {...target.EcsParameters, TaskDefinitionArn: taskDefinitionArn }}));
      core.debug(`Found ${targets.length} for ${rule}.`);
    } catch (e) {
      core.setFailed(e.message)
      throw(e)
    }

    if (!targets.length) continue;

    try {
      const putTargetsCommand = new PutTargetsCommand({
        Rule: rule,
        Targets: targets
      });

      core.debug(`Updating targets for ${rule}.`);
      const response = await cloudwatchClient.send(putTargetsCommand);
      core.debug(`Updated targets for ${rule}.`);
    } catch (e) {
      core.setFailed(e.message)
      throw(e)
    }
  }
}

run().then(() => process.exit(0))
