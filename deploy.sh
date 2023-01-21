#!/bin/bash

# Let's make the output pretty, shall we? ;)
# $1 is the text to output
# $2 is the text color
color () {
  color_red="1;31"
  color_green="1;32"
  color_yellow="1;33"
  color_blue="1;34"
  textColor="color_$2"
  echo -e "\e[${!textColor}m$1\e[0m"
}
error() { color "$1" "red"; }
success() { color "$1" "green"; }
warning() { color "$1" "yellow"; }
info() { color "$1" "blue"; }

info "\n### LIATRIO-TECHNICAL-EXERCISE ###\n"

info "checking prerequisites..."

# check to make sure that the prerequisite is installed
# $1 is the name of the prerequisite
# $2 is the command to run to test if it's installed
# $3 is the instructions to output if a non-zero status is returned from $2
testPrerequisite () {
  # run the test command (suppress all output)
  $2 >/dev/null 2>&1
  # capture the return code
  result=$?

  if [ $result -ne 0 ]; then
    error "
$1 is required.

$3
"
    exit -1
  else 
    success "✓ $1"
  fi
}

testPrerequisite "Node.js" "node -v" "Find the binaries for your platform at 
https://nodejs.org/en/download/

If you have done this and still get this message while running as sudo,
make sure that the node executable is accessible via the secure_path option
in /etc/sudoers, or run in a sudo bash session."

testPrerequisite "Docker" "docker ps" "To install Docker, follow the installation guide at
https://docs.docker.com/engine/install/

If Docker is installed and in your PATH, perhaps it requires
sudo permissions. In that case you have two options:

* Set up Docker to be accessible from non-root users. Instructions
  for this can be found here: 
  https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
* Run this command from an elevated (sudo) Bash session"

testPrerequisite "kubectl" "which kubectl" "Follow the guide for your OS here:
https://kubernetes.io/docs/tasks/tools/#kubectl"

testPrerequisite "AWS CLI" "aws --version" "Installation guide here:
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"

testPrerequisite "Pulumi" "pulumi version" "Getting started guide:
https://www.pulumi.com/docs/get-started/install/

If you have done this and still get this message while running as sudo,
make sure that the pulumi executable is accessible via the secure_path option
in /etc/sudoers, or run in a sudo bash session."

info "\nstarting deployment...\n"

pushd pulumi

pulumi up --stack dev

popd

echo ""
