# Sonic Bridge Validator

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Wallet Private Key](#wallet-private-key)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Security Considerations](#security-considerations)
- [Infrastructure Requirements](#infrastructure-requirements)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Sonic Bridge Validator is a service that listens for bridge events emitted by smart contracts. Upon detecting an event, the validator verifies it, signs the event message, and sends the signed message to relayer services. This crucial component ensures the integrity and security of cross-chain transactions in the Sonic Bridge ecosystem.

## Features

- Real-time monitoring of bridge events
- Event verification and signature
- Secure key management using AWS KMS
- Efficient message relay to relayer services

## Prerequisites

- Node.js (version X.X.X or higher)
- AWS account with KMS access
- Basic understanding of blockchain bridges and validator operations

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/mirrorworld-universe/sonic-bridge-validator.git
   cd sonic-bridge-validator
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

### Wallet Private Key

The validator service uses AWS KMS (Key Management Service) to securely manage your wallet's private key. Follow these steps to set up your private key:

1. Generate an encrypted wallet private key using AWS KMS.
2. Set the encrypted private key to the `WALLET_PRIVATE_KEY` environment variable.

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
WALLET_PRIVATE_KEY=your_encrypted_private_key
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

## Usage

To start the validator service:

```
npm start
```

## Security Considerations

While AWS KMS provides a secure environment for key management, it's essential to follow these best practices:

1. **Safeguard Key Usage Permissions**: Implement least privilege access principles, granting only necessary permissions to trusted users or applications.

2. **Regularly Review IAM and KMS Permissions**: Periodically audit permissions associated with your KMS keys to prevent stale or excessive access.

3. **Set Up CloudWatch Alerts**: Use AWS CloudWatch to monitor unusual activity related to your KMS keys. Set alerts for key creation, deletion, or unauthorized access attempts.

## Infrastructure Requirements

The Sonic Bridge Validator has modest hardware requirements and can run on physical or virtual machines with a stable network connection.

Recommended Configuration:
- **CPU**: 1 core
- **Memory**: 1GB RAM
- **Storage**: 10GB
- **Bandwidth**: 100Mbps

## Troubleshooting

If you encounter issues:

1. Check the logs for error messages
2. Verify your AWS credentials and permissions
3. Ensure your network connection is stable
4. Reach out to Sonic Engineering Support team at [operators@sonic.game](mailto:operators@sonic.game)
5. Open an issue on this GitHub repository)

For additional help, please open an issue on our GitHub repository.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
