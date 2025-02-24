import login from "../selectors/login.css";
import moment from 'moment';
import { selectBookingDetailsService } from '../selectors/bookingServices.css';

describe("Booking flow - verifying Kurtaxe & Cleaning Fee on invoice", () => {
  it("should correctly show the Kurtaxe and Cleaning Fee price on the invoice", () => {

   cy.visit("/login");

    cy.get(login.emailField).type(Cypress.env("email"));
    cy.get(login.passwordField).type(Cypress.env("password"));
    cy.get(login.signInButton).click();

   
    cy.get(login.navBar)
        .should("be.visible")
        .within(() => {
          cy.contains("Welcome").should("be.visible");
    });

    cy.get('[data-testid="add-booking-btn"]').click();
   
    Cypress._.times(6, () => {
      cy.get('[role="button"][aria-label="Move forward to switch to the next month."]')
        .should('be.visible')
        .click();
        
      cy.wait(1000);

    });

    const checkInLabel = moment().add(6, 'months').format('dddd, D MMMM YYYY');
    const checkOutLabel = moment().add(6, 'months').add(2, 'days').format('dddd, D MMMM YYYY');

    cy.get(`td.CalendarDay[aria-label*="${checkInLabel}"]`).click();
    cy.get(`td.CalendarDay[aria-label*="${checkOutLabel}"]`).click();

    cy.get('input[name="customer.fullName"]').should("be.visible").type("Popescu");

    cy.wait(3000); 

    cy.get('[data-testid^="autocomplete-item-"]') 
      .eq(1) 
      .should("be.visible") 
      .click({ force: true });

    cy.get('#mui-component-select-_roomBookings').click();

    cy.get('[data-testid="select-item-1"]').click();

    cy.get('[data-testid="select-item-2"]').click();

    cy.contains('.MuiButtonBase-root.MuiButton-root', 'Save').click();

    cy.contains('button', 'Create booking').should('be.visible').click();

    cy.wait(15000); 
 
    cy.visit("/bookings?sortField=createdAt&sortDirection=DESC&includeDeletedBookings=true&fullSearch=Popescu");

    cy.wait(25000); 

    cy.get('[data-testid="table-row-0"]', { timeout: 30000 }).should('be.visible').click();

    cy.contains('th', 'Kurtaxe HS').should('be.visible');

    cy.contains('th', 'Cleaning Fee').should('be.visible');

    cy.get('[data-testid="MoreVertIcon"]').click();

    cy.contains('li.MuiMenuItem-root', 'View invoice').click();

    selectBookingDetailsService('Kurtaxe HS')
      .should('contain.text', '€80.00');

    selectBookingDetailsService('Cleaning Fee')
      .should('contain.text', '€40.00');
  });

})