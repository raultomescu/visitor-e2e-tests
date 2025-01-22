import login from "../selectors/login.css";
import header from "../selectors/header.css";

describe("Login", () => {
  context("unsuccessful", () => {
    it("can see error message when password incorrect", () => {
      cy.visit("/login");

      cy.get(login.emailField).type("support@visitorapp.co");
      cy.get(login.passwordField).type("abcd");
      cy.get(login.signInButton).click();
      cy.get(login.errorMessages)
        .should("be.visible")
        .and("contain", "Benutzername oder Passwort falsch");
    });

    it("can see error message when username incorrect", () => {
      cy.visit("/login");

      cy.get(login.emailField).type("s@visitorapp.co");
      cy.get(login.passwordField).type("oJlF^Pza6Tzv");
      cy.get(login.signInButton).click();
      cy.get(login.errorMessages)
        .should("be.visible")
        .and("contain", "Benutzername oder Passwort falsch");
    });
  });

  context("reset password", () => {
    it("should reset the password", () => {
      cy.visit("/login");

      cy.get(login.forgotPasswordButton).click();
      cy.get(login.emailField).type("marcelmueller@visitorstart.de");
      cy.get(login.forgotPasswordButton).click();
      cy.contains(
        "Passwort zurücksetzten E-mail wurde erfolgreich gesendet"
      ).should("be.visible").wait(10000);

      cy.task('fetchResetLink').then((resetLink) => {
        cy.visit(resetLink);
        cy.get(login.passwordField).type("abcdABCD1234");
        cy.get(login.repeatPassword).type("abcdABCD1234");
        cy.get(login.resetPasswordButton).click();
        cy.get(login.resetPasswordSuccessAlert)
        .should("be.visible")
        .and("contain", "Passwort erfolgreich geändert");
        cy.get(login.signInButton).click();
        cy.get(login.emailField).type("marcelmueller@visitorstart.de");
        cy.get(login.passwordField).type("abcdABCD1234");
        cy.get(login.signInButton).click();
        cy.get(login.navBar)
          .should("be.visible")
          .within(() => {
            cy.contains("Dashboard").should("be.visible");
          });
      });
    });
  });

  context("successful", () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit("/login");
    });

    it("can log in", function () {
      cy.get(login.emailField).type("support@visitorapp.co");
      cy.get(login.passwordField).type("oJlF^Pza6Tzv");
      cy.get(login.signInButton).click();
      cy.get(login.navBar)
        .should("be.visible")
        .within(() => {
          cy.contains("Welcome").should("be.visible");
        });
    });
  });
});
