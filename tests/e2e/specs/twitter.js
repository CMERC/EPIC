describe('Twitter Preview', () => {
  it('Should Create Twitter', () => {
    cy.register().then(() => {
      cy.request({
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('token')
        },
        method: 'POST',
        body: {
          query: `mutation MediaServicesCreate($data: MediaServiceCreateInput!) { createMediaService(data: $data) { id name displayName } }`,
          variables: {
            data: {
              name: 'twitter',
              displayName: 'Twitter',
              type: 'SOCIALMEDIA',
              icon: 'fab fa-twitter'
            }
          }
        }
      })

      cy.request({
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('token')
        },
        method: 'POST',
        body: {
          query: `mutation MediaProfilesCreate($data: MediaProfileCreateInput!) { createMediaProfile(data: $data) {id service { name } username name description banner { id mediaFile { id name url } } avatar { id name url } url createdTime isUserGenerated } }`,
          variables: {
            data: {
              service: {
                connect: {
                  name: 'twitter'
                }
              },
              username: 'TwitterTest',
              name: 'TwitterTest',
              description: 'Profile Created for Test Purposes',
              isUserGenerated: true,
              avatar: {
                create: {
                  name:
                    'shallow focus photography of woman in brown floral top',
                  url: {
                    raw:
                      'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=cb95c9600c9cdbc23703d8de8259096b',
                    full:
                      'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=6aa4e977e0b24033363977bd8a153bbe',
                    regular:
                      'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=c99f149aa0934c267e28adaadd35da6f',
                    small:
                      'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=03d28cc790c07ea09cf5249778453c5f',
                    thumb:
                      'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=6d6c1bb0b7ca4374ed533ade048f941e'
                  },
                  contentType: 'image/jpg',
                  createTime: '2018-07-10T15:38:51-04:00',
                  updateTime: '2018-08-28T21:13:48-04:00'
                }
              },
              banner: {
                create: {
                  mediaFile: {
                    create: {
                      name: 'Photo',
                      url: {
                        raw:
                          'https://images.unsplash.com/photo-1539896049853-1c8a9e95dee9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=a14c584334c8f56c2de02f3c8cfd3d72',
                        full:
                          'https://images.unsplash.com/photo-1539896049853-1c8a9e95dee9?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=3f2bd5163109ecf0eaa9aed919a5b3f3',
                        regular:
                          'https://images.unsplash.com/photo-1539896049853-1c8a9e95dee9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=919b5217ecff8f8bf0800540a57f2a1f',
                        small:
                          'https://images.unsplash.com/photo-1539896049853-1c8a9e95dee9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=fdcdec6510e6827710e77f8679b5c02b',
                        thumb:
                          'https://images.unsplash.com/photo-1539896049853-1c8a9e95dee9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjI0NzA2fQ&s=cb2ad62fafe9eaa471ec1c4941da9553'
                      },
                      contentType: 'image/jpg',
                      createTime: '2018-10-18T16:56:27-04:00',
                      updateTime: '2018-10-19T11:23:55-04:00'
                    }
                  }
                }
              }
            }
          }
        }
      }).then(profile => {
        let currentDate = new Date().toISOString()
        let profileID = profile.body.data.createMediaProfile.id
        cy.request({
          url: '/graphql',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + localStorage.getItem('token')
          },
          method: 'POST',
          body: {
            query: `mutation MediaPostsCreate($data: MediaPostCreateInput!) { createMediaPost(data: $data) { id createdAt updatedAt createTime updateTime isPublished publishTime title text url isUserGenerated profiles { id service { name displayName type icon color } name username description banner { id mediaFile { id name url } } avatar { id name url } location { geojson } } location { geojson } mediaFile { id name url contentType } } }`,
            variables: {
              data: {
                isPublished: true,
                title: 'This is a Post with media',
                text: 'This is a Post with media',
                url: '{"service": "twitter", "profile": "TwitterTest"}',
                isUserGenerated: true,
                createTime: currentDate,
                updateTime: currentDate,
                publishTime: currentDate,
                profiles: {
                  connect: {
                    id: profileID
                  }
                }
              }
            }
          }
        }).then(res => {
          //Go to Profile View
          cy.visit('/web/global/twitter/TwitterTest')
          cy.screenshot('profile-view')

          //Go to Profile View
          cy.visit(
            '/web/global/twitter/TwitterTest/' +
              res.body.data.createMediaPost.id
          )
          cy.screenshot('post-view')
        })
      })
    })
  })
})
