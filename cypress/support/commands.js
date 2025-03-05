Cypress.Commands.add("checkBookingInformation", () => {
    const expectedFullName = "Popescu Maria";
    const expectedEmail = "maria@gmail.com";
    const expectedPhoneNumber = "0712345678";
    const expectedBookingSource = "Website";
    const expectedCheckInDate = "01/01/2026";
    const expectedCheckOutDate = "02/01/2026";
    const expectedNumberOfAdults = "1";
    const expectedNumberOfChildren = "1";
    const expectedPricePerNight = "149";
  
    // cy.get('[data-testid="first-name"]')
    //   .contains(expectedFullName)
    //   .first()
    //   .click();
  
    cy.get('[data-testid="MoreVertIcon"]').click();
    cy.get('[data-testid="edit-btn"]').click();
  
    cy.get('input[name="customer.fullName"]')
      .should("have.value", expectedFullName);
  
    cy.get('input[name="customer.email"]')
      .should("have.value", expectedEmail);
  
    cy.get('input[name="customer.phoneNumber"]')
      .should("have.value", expectedPhoneNumber);
  
    cy.get('#mui-component-select-bookingSource')
      .should('contain.text', expectedBookingSource);
  
    cy.get('input[placeholder="DD/MM/YYYY"]').eq(0)
      .should('have.value', expectedCheckInDate);
  
    cy.get('input[placeholder="DD/MM/YYYY"]').eq(1)
      .should('have.value', expectedCheckOutDate);
  
    cy.get('input[id="roomBookings[0].numberOfAdults"]')
      .should("have.value", expectedNumberOfAdults);
  
    cy.get('input[id="roomBookings[0].numberOfChildren"]')
      .should("have.value", expectedNumberOfChildren);
  
    cy.get('input[id="roomBookings[0].pricePerNight"]')
      .should("have.value", expectedPricePerNight);
  });
  