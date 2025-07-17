# PetCare GitHub Configuration

This directory contains GitHub-specific configuration files for the PetCare application.

## Contents

### Workflows

The `workflows/` directory contains GitHub Actions workflow definitions that automate testing, building, and security scanning of the application. See the [Workflows README](./workflows/README.md) for detailed information about each workflow.

## GitHub Actions Overview

GitHub Actions is used in this project to automate the following tasks:

1. **Continuous Integration (CI)**: Automatically run tests when code is pushed or pull requests are created
2. **Building**: Create production-ready builds of the application components
3. **Security Scanning**: Regularly check for security vulnerabilities in dependencies

## Getting Started with GitHub Actions

To use these GitHub Actions workflows:

1. Push your code to GitHub
2. Navigate to the "Actions" tab in your GitHub repository
3. You'll see the workflows running automatically based on their trigger conditions

## Customizing Workflows

To customize the existing workflows or add new ones:

1. Edit or create YAML files in the `.github/workflows/` directory
2. Commit and push your changes
3. GitHub will use the updated workflows for subsequent runs

## Environment Variables and Secrets

Some workflows require environment variables or secrets. To add these to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret" to add sensitive information
4. Use these secrets in your workflows with `${{ secrets.SECRET_NAME }}`

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)