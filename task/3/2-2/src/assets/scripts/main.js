// TODO: site logics
const $ = window.$

$(($) => {
  const $body = $('html, body')

  $('#scroll_top').on('click', () => {
    $body.animate({ scrollTop: 0 }, 600)
    return false
  })
})