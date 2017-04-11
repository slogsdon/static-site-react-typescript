---
title: Develop .NET Core Applications with Docker
author: shane
layout: post
categories:
  - All Posts
  - Programming
tags:
  - .net
  - docker
description: Learn what it takes to leverage Docker and Docker Compose from development through deployment for your .NET Core applications.
---

One of the biggest draws of using Docker is the ability to deploy a container or set of containers for you application, moving the container(s) through each of your environments as your testing procedures are completed. 

## Fulfill Requirements

- Docker + Docker Compose
- Knowledge of the Docker ecosystem

## Setup Your Project

Leverage Microsoft's Docker image: https://hub.docker.com/r/microsoft/dotnet/

```yaml
version: "2.1"
services:
  # Language service to define base image, shared volumes, etc.
  dotnet:
    # String interpolation for using/testing multiple tag versions
    image: microsoft/dotnet:${DOTNET_VERSION:-1.1}-sdk-projectjson
    volumes:
      # Named volume
      # Must also be defined under `volumes` below
      - nuget:/root/.nuget
      # Anonymous volume
      # Mapped to host system
      - .:/src
    working_dir: /src

  # Main web application service
  app:
    extends:
      service: dotnet
    command: dotnet run
    # Forward application port to host
    ports:
      - "5000:5000"
    environment:
      # Ensure application listens on all addresses
      ASPNETCORE_URLS: "http://*:5000"

  # Setup task to prepare environment
  setup:
    extends:
      # Extend language service to centralize configuration
      service: dotnet
    # Wrap setup steps with `sh -c` to ensure all steps
    # are passed to the container and ran properly
    command: sh -c "dotnet --version && dotnet restore"

  # Test task
  test:
    extends:
      service: dotnet
    command: dotnet test

# Named volumes
volumes:
  nuget:
```

By defining a configuration file for Docker Compose, we allow Docker Compose to handle the creation and management of each of our containers, increasing the amount of time we can spend on development.

## Run Tasks/Services

We can scaffold a new project:

```bash
docker-compose run --rm dotnet dotnet new -t web
```

or restore dependencies and run other setup tasks:

```bash
docker-compose run --rm setup
```

and even run our test project:

```bash
$ docker-compose run --rm test
Project src (.NETCoreApp,Version=v1.1) will be compiled because the version or bitness of the CLI changed since the last build
Compiling src for .NETCoreApp,Version=v1.1
/src/project.json(9,46): warning NU1007: Dependency specified was dotnet-test-xunit >= 1.0.0-rc2-192208-24 but ended up with dotnet-test-xunit 1.0.0-rc2-build10015.

Compilation succeeded.
    1 Warning(s)
    0 Error(s)

Time elapsed 00:00:01.0173389


xUnit.net .NET CLI test runner (64-bit debian.8-x64)
  Discovering: src
  Discovered:  src
  Starting:    src
  Finished:    src
=== TEST EXECUTION SUMMARY ===
   src  Total: 1, Errors: 0, Failed: 0, Skipped: 0, Time: 0.170s
SUMMARY: Total: 1 targets, Passed: 1, Failed: 0.
```

Running our application will take a slightly different but easier form, causing all defined services to start as a group:

```bash
$ docker-compose up
Creating network "temp_default" with the default driver
Creating temp_dotnet_1
Creating temp_setup_1
Creating temp_app_1
Attaching to temp_dotnet_1, temp_setup_1, temp_app_1
setup_1   | 1.0.0-preview2-1-003177
setup_1   | log  : Restoring packages for /src/project.json...
temp_dotnet_1 exited with code 0
setup_1   | warn : Dependency specified was Microsoft.NETCore.App (>= 1.1.0-preview1-001153-00) but ended up with Microsoft.NETCore.App 1.1.0.
app_1     | Project src (.NETCoreApp,Version=v1.1) was previously compiled. Skipping compilation.
setup_1   | log  : Restoring packages for tool 'Microsoft.AspNetCore.Razor.Tools' in /src/project.json...
app_1     | info: Microsoft.Extensions.DependencyInjection.DataProtectionServices[0]
app_1     |       User profile is available. Using '/root/.aspnet/DataProtection-Keys' as key repository; keys will not be encrypted at rest.
app_1     | Hosting environment: Production
app_1     | Content root path: /src
app_1     | Now listening on: http://*:5000
app_1     | Application started. Press Ctrl+C to shut down.
setup_1   | log  : Restoring packages for tool 'Microsoft.AspNetCore.Server.IISIntegration.Tools' in /src/project.json...
setup_1   | log  : Restoring packages for tool 'Microsoft.EntityFrameworkCore.Tools' in /src/project.json...
setup_1   | log  : Restoring packages for tool 'Microsoft.Extensions.SecretManager.Tools' in /src/project.json...
setup_1   | log  : Restoring packages for tool 'Microsoft.VisualStudio.Web.CodeGeneration.Tools' in /src/project.json...
setup_1   | log  : Lock file has not changed. Skipping lock file write. Path: /src/project.lock.json
setup_1   | log  : /src/project.json
setup_1   | log  : Restore completed in 7287ms.
temp_setup_1 exited with code 0
```

If you noticed in the logging output from `docker-compose up`, there are log messages from each service as it starts up, interweaved with the others in no particular order. Services are started in no particular order, so when debugging your application, you may notice this at times. Don't Panic.

That being said, log messages will mostly be grouped by service and/or event. For instance, accessing the web app will be reflected in logs as a single grouping:

```bash
curl http://localhost:5000
```

```
app_1     | info: Microsoft.AspNetCore.Hosting.Internal.WebHost[1]
app_1     |       Request starting HTTP/1.1 GET http://localhost:5000/
app_1     | info: Microsoft.AspNetCore.Mvc.Internal.ControllerActionInvoker[1]
app_1     |       Executing action method WebApplication.Controllers.HomeController.Index (src) with arguments () - ModelState is Valid
app_1     | info: Microsoft.AspNetCore.Mvc.ViewFeatures.Internal.ViewResultExecutor[1]
app_1     |       Executing ViewResult, running view at path /Views/Home/Index.cshtml.
app_1     | info: Microsoft.AspNetCore.Mvc.Internal.ControllerActionInvoker[2]
app_1     |       Executed action WebApplication.Controllers.HomeController.Index (src) in 2845.3965ms
app_1     | info: Microsoft.AspNetCore.Hosting.Internal.WebHost[2]
app_1     |       Request finished in 3140.2972ms 200 text/html; charset=utf-8
```

## Organize Your Configuration

`docker-compose up` runs all services configured in the given `docker-compose.yml`. Best option to control which services are ran is to use multiple configuration files, e.g. one to hold services to run application and one to hold one-off tasks. if tasks in `tasks.yml`, they can be ran with `docker-compose -f tasks.yml run --rm command_name`.

for instance, let's abstract out the `setup` and `test` services into a `tasks.yml` file:

```yaml
version: "2.1"
services:
  setup:
    extends:
      file: docker-compose.yml
      service: dotnet
    command: sh -c "dotnet --version && dotnet restore"

  test:
    extends:
      file: docker-compose.yml
      service: dotnet
    command: dotnet test

volumes:
  nuget:
```

The only downside is the additional verbosity, 1) the requirement of re-specifying shared volumes in both files and 2) the need of specifying the necessary file in the `extends` section and when calling `docker-compose run`. In my opinion, these downsides are outweighed by the upsides, isolated concerns, `docker-compose.yml` able to be used in production/swarm scenarios, etc.

Now, when calling `docker-compose up`, only required services are started:

```bash
$ docker-compose up
Starting temp_dotnet_1
Starting temp_app_1
Attaching to temp_app_1, temp_dotnet_1
temp_dotnet_1 exited with code 0
app_1     | Project src (.NETCoreApp,Version=v1.1) was previously compiled. Skipping compilation.
app_1     | info: Microsoft.Extensions.DependencyInjection.DataProtectionServices[0]
app_1     |       User profile is available. Using '/root/.aspnet/DataProtection-Keys' as key repository; keys will not be encrypted at rest.
app_1     | Hosting environment: Production
app_1     | Content root path: /src
app_1     | Now listening on: http://*:5000
app_1     | Application started. Press Ctrl+C to shut down.
```

## Extend Your Application

Add DB service: https://hub.docker.com/r/microsoft/mssql-server-linux/

```yaml
version: "2.1"
services:
  # ...

  db:
    image: microsoft/mssql-server-linux
    ports:
      - 1433:1433
    environment:
      ACCEPT_EULA: Y
      SA_PASSWORD: "yourStrong(!)Password"
  
  # ...
```

With default network created by `docker-compose`, all other will have access to SqlServer via the `db` host name.

Along the same lines, we can even define a service in our Docker Compose configuration that uses a Node.js base image to run a frontend build tool.
