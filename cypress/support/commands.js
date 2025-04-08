import { address } from "./constants"; 

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

    cy.get('input[name="bookingServices[0].isActive"]')
      .should('be.checked');
  
    cy.get('input[name="bookingServices[1].isActive"]')
      .should('be.checked');
  });

  Cypress.Commands.add("login", (loginSelectors) => {
    cy.visit("/login", {
      timeout: 180000,
      failOnStatusCode: false
    });
  
    cy.get(loginSelectors.emailField).type(Cypress.env("email"));
    cy.get(loginSelectors.passwordField).type(Cypress.env("password"));
    cy.get(loginSelectors.signInButton).click();
  
    cy.wait(6000);
    cy.contains("Welcome", { timeout: 30000 }).should("be.visible");
  });

  Cypress.Commands.add("fillAddress", (addr = address) => {
  
    cy.get('input[name="address.streetName"]').clear().type(addr.streetName);
    cy.get('input[name="address.streetNumber"]').clear().type(addr.streetNumber);
    cy.get('input[name="address.zipCode"]').clear().type(addr.zipCode);
    cy.get('input[name="address.city"]').clear().type(addr.city);
    cy.get('input[name="address.country"]').clear().type(addr.country);
  });