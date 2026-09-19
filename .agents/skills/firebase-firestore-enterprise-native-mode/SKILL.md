---
name: firebase-firestore-enterprise-native-mode
description: Provision, model, secure, or use the SDK for Firestore Enterprise Native only when this edition and mode are explicitly requested or confirmed for the target database. General Firestore rules or SDK questions do not establish Enterprise usage.
compatibility: This skill is best used with the Firebase CLI, but does not require it. Firebase CLI can be accessed through `npx -y firebase-tools@latest`.
---

# Firestore Enterprise Native Mode

This skill provides a complete guide for getting started with Firestore Enterprise Native Mode, including provisioning, data model, security rules, and SDK usage.

## Provisioning

To set up Firestore Enterprise Native Mode in your Firebase project and local environment, see [provisioning.md](references/provisioning.md).

## Data Model

To learn about Firestore data model and how to organize your data, see [data_model.md](references/data_model.md).

## Security Rules

For guidance on writing and deploying Firestore Security Rules to protect your data, see [security_rules.md](references/security_rules.md).

## SDK Usage

To learn how to use Firestore Enterprise Native Mode in your application code, see:
- [Web SDK Usage](references/web_sdk_usage.md)
- [Python SDK Usage](references/python_sdk_usage.md)

## Indexes

Indexes help improve query performance and speed up slow queries. For checking index types, query support tables, and best practices, see [indexes.md](references/indexes.md).

## Edition selection

Use the edition confirmed for the target database; do not load both Standard and Enterprise guides for the same operation. If the edition is unknown, inspect existing configuration and ask only when the difference affects the task. An explicit edition comparison may use both guides.
