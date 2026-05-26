// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('register', () => {
  cy.exec('cd server && npx prisma1 reset --force')

  cy.visit('/register')
  //Register
  const testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test1'
  }
  let userID
  let token
  let workspaceID

  cy.request({
    url: '/graphql',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: {
      query: `mutation Signup($data: SignupInput!) {signup(data: $data) {token user {id email name inviteAccepted emailConfirmed deletedAt lastLogin joinedAt isSuper __typename } __typename } } `,
      variables: {
        data: {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password
        }
      }
    }
  }).then(res => {
    userID = res.body.data.signup.user.id
    token = res.body.data.signup.token
    window.localStorage.setItem('token', token)
    cy.request({
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      method: 'POST',
      body: {
        query: `mutation UpsertAppRole(
            $create: AppRoleCreateInput!
            $update: AppRoleUpdateInput!
            $where: AppRoleWhereUniqueInput!){ 
            upsertAppRole(create: $create, update:$update, where:$where) { name }}`,
        variables: {
          create: { name: 'ADMIN', displayName: 'ADMIN' },
          update: { name: 'ADMIN', displayName: 'ADMIN' },
          where: { name: 'ADMIN' }
        }
      }
    })

    cy.request({
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      method: 'POST',
      body: {
        query: `mutation UpsertAppUserRole(
          $create: AppUserRoleCreateInput!
          $update: AppUserRoleUpdateInput!
          $where: AppUserRoleWhereUniqueInput!
        ) {
          upsertAppUserRole(create: $create, update: $update, where: $where) {
            id
          }
        }`,
        variables: {
          create: {
            user: { connect: { id: userID } },
            roles: { connect: { name: 'ADMIN' } }
          },
          update: { roles: { connect: { name: 'ADMIN' } } },
          where: { id: '' }
        }
      }
    })
    cy.visit('/')
    cy.get('[data-cy="noWorkSpace"]')
      .find('a')
      .click()
    cy.request({
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      method: 'POST',
      body: {
        query: `mutation AppWorkspaceCreate($data: AppWorkspaceCreateInput!) {
          createAppWorkspace(data: $data) {
            id name
          }
        }`,
        variables: {
          data: {
            name: 'global',
            displayName: 'Global'
          }
        }
      }
    }).then(workspace => {
      workspaceID = workspace.body.data.createAppWorkspace.id
      cy.request({
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        method: 'POST',
        body: {
          query: `mutation AppWorkspaceUpdate(
          $data: AppWorkspaceUpdateInput!
          $where: AppWorkspaceWhereUniqueInput!
        ) {
          updateAppWorkspace(data: $data, where: $where) {
            name
          }
        }`,
          variables: {
            data: {
              members: {
                connect: {
                  id: userID
                }
              }
            },
            where: { id: workspaceID }
          }
        }
      })
    })
  })
})

Cypress.Commands.add('login', () => {
  cy.viewport(1280, 720)
  cy.visit('/')

  const adminUser = {
    email: 'admin@admin.com',
    password: 'admin'
  }
  cy.request({
    url: '/graphql',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: {
      query: `mutation Login($email: String!, $password: String!) {login (email: $email, password: $password) {token user {email name inviteAccepted emailConfirmed deletedAt lastLogin joinedAt isSuper __typename } __typename } }`,
      variables: { email: adminUser.email, password: adminUser.password }
    }
  }).then(res => {
    window.localStorage.setItem('token', res.body.data.login.token)
    cy.log(res)
    cy.visit('/')
  })
})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
