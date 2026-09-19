---
name: firebase-firestore-standard
description: Provision, secure, or use the SDK for Firestore Standard Edition when Standard is requested or confirmed for the target database. Resolve an unknown edition from context before using edition-specific guidance; do not apply to confirmed Enterprise Native databases.
compatibility: This skill is best used with the Firebase CLI, but does not require it. Firebase CLI can be accessed through `npx -y firebase-tools@latest`. 
---

# Firestore Standard Edition

This skill provides a complete guide for getting started with Cloud Firestore Standard Edition, including provisioning, securing, and integrating it into your application.

## Provisioning

To set up Cloud Firestore in your Firebase project and local environment, see [provisioning.md](references/provisioning.md).

## Security Rules

For guidance on writing and deploying Firestore Security Rules to protect your data, see [security_rules.md](references/security_rules.md).

## SDK Usage

To learn how to use Cloud Firestore in your application code, choose your platform:

*   **Web (Modular SDK)**: [web_sdk_usage.md](references/web_sdk_usage.md)

## Indexes

For checking index types, query support tables, and best practices, see [indexes.md](references/indexes.md).

## Edition selection

Use only the guide for the target database edition. Do not load Enterprise guidance unless Enterprise Native is explicitly requested or confirmed, or an edition comparison is requested. Ask about an unknown edition only when it affects the task.
