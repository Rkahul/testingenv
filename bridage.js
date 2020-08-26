const { events, Job } = require("brigadier");
events.on("exec", (e, p) => {
    console.log("Received push for commit " + e.revision.commit)
    var commit = e.revision.commit.substr(e.revision.commit.length - 7);
    commit = e.revision.commit.substring(0, 7);
    var greeting = new Job("job1", "alpine:latest");
    greeting.storage.enabled = true;
    greeting.tasks = [
        "echo Hello Pipeline",
        `echo correct output showing on terminal`

    ]
    var docker = new Job("job2" , "docker:dind");
    docker.privileged = true;
    docker.env = {
    DOCKER_DRIVER: "overlay"
    };

docker.env.DOCKER_USER = project.secrets.DOCKER_USER
docker.env.DOCKER_PASS = project.secrets.DOCKER_PASS

docker.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 10",
    "cd /src/",
    "pwd",
    "ls -lart",
    "docker build -t rahuldhus766/brigade:v6 .",
    "docker login docker.io -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push rahuldhus766/brigade:v6",
    "docker images",

]
   greeting.run();
   docker.run();

});


