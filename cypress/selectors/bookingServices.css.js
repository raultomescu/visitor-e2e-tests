export function selectBookingDetailsService(serviceName) {
    return cy
     
      .get(`input.input.dark[value="${serviceName}"]`)

      .closest('div.view.w-70.p-4.flex')
  
      .siblings('.view.w-18.p-4')

      .find('.span.dark.right');
  }
  