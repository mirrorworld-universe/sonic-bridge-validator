# sonic-bridge-validator

## Introduction

The sonic bridge validator service listen for bridge events emitted by the contracts. Once an event is detected, the validator 
service will verify this event, sign the event message and send the signed message to relayer services.


## Wallet Private Key
	
The validator service use AWS KMS(AWS Key Management Service) to keep your wallet private key.

### Generate And Set Private Key

<ol>
<li>generate encrypted wallet private key with KMS;</li>
<li>set the encrypted private key to ENV.WALLET_PRIVATE_KEY;</li>
</ol>

### Wallet Private Key Security

While AWS KMS provides a secure environment for key management, it's essential to follow best practices to ensure the 
private key remains secure. Here are some key points to remember:

- **Safeguard Key Usage Permissions**: Ensure that only trusted users or applications have the right to perform sensitive 
operations with the private key. Use least privilege access principles to grant only necessary permissions.

- **Regularly Review IAM and KMS Permissions**: Periodically audit the permissions associated with your KMS keys to prevent 
 stale or excessive permissions. This ensures that only authorized users or systems have access to the keys.

- **Set Up CloudWatch Alerts**: Use AWS CloudWatch to monitor unusual activity related to your KMS keys. For example, 
set alerts for key creation, deletion, or unauthorized access attempts. This allows for quick action if there are any security anomalies.


## Infrastructure

The sonic validator service does not require high hardware requirements, You can run the validator service on physical 
machine or virtual machine. just make sure the network is smooth.

### Hardware Requirements

Recommended Configuration:

- **CPU**: 1 core
- **Memory**: 1GB
- **Storage**: 10GB
- **Network**: 100Mbps