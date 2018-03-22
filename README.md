# Sock It To Me! _(Backend API)_
Backend server for Sock It To Me! educational quiz game.

## Routes
### Auth
##### `POST /api/v1/register`
* `request`: receives `POST` with body containing `username` and `password` properties
* `response`: saves authenticated `user`, sends `201` (created) and a `token` (JWT)
* `error`: 
  * invalid `username` or `password`: sends `400` (bad-request) error
  * `username` taken: sends `200` (okay) with a message explaining the conflict
##### `GET /api/v1/login`
* `request`: receives `GET` with body containing `username` and `password` properties
* `response`: sends `200` (okay) with body containing JWT `token`
* `error`:
  * invalid `password`: sends `400` (bad-request) error
  * `username` not found: sends `404` (not-found) error
### Profile
##### `GET api/v1/profile/{_id}`
* `request`: receives `GET` with a user model's `_id` as
* `response`: sends `200` (okay) with body containing  a user `profile`
* `error`:
  * unauthorized `token`: sends `401` (unauthorized) error

## Middleware

## socket.io

## Testing
### Coverage
