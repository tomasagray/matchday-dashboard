# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - (upcoming changes)

## [0.6.6] - 2025-10-03

### Fixed

- API URL prefix
- Styling improvements

## [0.6.5] - 2025-09-29

### Fixed

- Unhandled video player exceptions
- Video stream deletion

### Added

- View Events by Team, Competition pages

## [0.6.4] - 2025-05-17

### Fixed

- Error from temporary null condition of links in TeamTile

## [0.6.3] - 2025-04-03

### Changed

- Improved user interface performance: updates are reflected immediately
- Improved handling of Events with no Video Sources
- Updated sanity report display to reflect new report format

### Added

- Download individual video stream capability
- Confirmation modal when interrupting or deleting a video stream

## [0.6.2] - 2025-01-29

### Added

- Tags can now be manually sorted

### Fixed

- Improved team fetching

## [0.6.1] - 2024-12-30

### Added

- File server user remaining bandwidth display

### Fixed

- Redundant header on some JSON exports

## [0.6.0] - 2024-12-26

### Added

- ffmpeg settings editor
- VPN settings editor
- A proper (albeit minimal) README

### Fixed

- Competition selection border
- Vulnerable dependencies

## [0.5.5] - 2024-06-11

### Changed

- Update to versioned Matchday server API (/api/<api_version>/)

## [0.5.4] - 2024-05-21

### Added

- Auto-heal sanity report button
- Add change log level on the fly control

## [0.5.3] - 2024-05-15

### Changed

- Updated to new server application settings

## [0.5.2] - 2024-03-30

### Fixed

- Merged version bumps for dependencies, security concerns
- Fixed broken icon on Add/Edit match wizard

## [0.5.1] - 2024-03-18

### Changed

- Improved Video Source icon
- Improved Sanity report & Datasource displays

### Added

- Download button for sanity reports
- Accordion, Datasource table components

## [0.5.0] - 2024-01-16

### Added

- Add/edit VideoSource dialog
- Add new Match, Competition & Team functionality

### Fixed

- Improved File Server User login form

## [0.4.0] - 2023-11-28

### Added

- VPN controls: Connect, Reconnect, Disconnect
- This changelog!

### Fixed

- Added MD5 hashing for VideoFileSourceDisplay keys