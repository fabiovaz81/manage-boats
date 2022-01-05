using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace BoatLux.Domain.Models.Fatura
{
    public class FaturaIuguModel
    {
        [DisplayName("email"), Description("E-mail do cliente *")]
        public string Email { get; set; }

        [DisplayName("cc_emails"), Description("E-mails de cópia separados por vírgula")]
        public string[] Cc_emails { get; set; }

        [DisplayName("due_date"), Description("Data do vencimento (AAA-MM-DD) *")]
        public DateTime due_date { get; set; }

        [DisplayName("ensure_workday_due_date"), Description("TRUE => Apenas dias úteis")]
        public bool EnsureWorkdayDueDate { get; set; }

        [DisplayName("items"), Description("Itens da fatura. 'price_cents' valor mínimo 100 *")]
        public List<Item> Items { get; set; }

        public class Item
        {
            [DisplayName("description"), Description("Descrição do item *")]
            public string Description { get; set; }

            [DisplayName("quantity"), Description("Quantidade do item")]
            public int Quantity { get; set; }

            [DisplayName("price_cents"), Description("Preço do item em centavos. Valor mínimo 100.")]
            public int PriceCents { get; set; }
        }

        [DisplayName("return_url"), Description("Direcionado para essa URL ao efetuar o pagto.")]
        public string ReturnUrl { get; set; }

        [DisplayName("expired_url"), Description("Direcionado para essa URL em caso de fatura expirada")]
        public string ExpiredUrl { get; set; }

        [DisplayName("notification_url"), Description("URL chamada para notificações da fatura")]
        public string NotificationUrl { get; set; }

        [DisplayName("ignore_canceled_email"), Description("Desliga o e-mail de cancelamento de fatura")]
        public bool IgnoreCanceledEmail { get; set; }

        [DisplayName("fines"), Description("Multa por atraso de pagamento")]
        public bool Fines { get; set; }

        [DisplayName("late_payment_fine"), Description("% após data do vencto.")]
        public int LatePaymentFine { get; set; }

        [DisplayName("per_day_interest"), Description("Se cobra juros por dia. 1% ao mês pro rata. Necessário passar a multa como true")]
        public bool PerDayInterest { get; set; }

        [DisplayName("per_day_interest_value"), Description("Informar o valor percentual de juros que deseja cobrar")]
        public int PerDayInterestValue { get; set; }

        [DisplayName("discount_cents"), Description("Valor dos Descontos em centavos")]
        public int DiscountCents { get; set; }

        [DisplayName("customer_id"), Description("ID do Cliente")]
        public string CustomerId { get; set; }

        [DisplayName("ignore_due_email"), Description("Ignora o envio do e-mail de cobrança")]
        public bool IgnoreDueEmail { get; set; }

        [DisplayName("subscription_id"), Description("Amarra esta Fatura com a Assinatura especificada")]
        public string SubscriptionId { get; set; }

        [DisplayName("payable_with"), Description("'all', 'credit_card', 'bank_slip' ou 'pix'")]
        public string[] PayableWith { get; set; }

        [DisplayName("credits"), Description("Caso tenha o 'subscription_id', pode-se enviar o número de créditos a adicionar nessa Assinatura baseada em créditos, quando a Fatura for paga.")]
        public int Credits { get; set; }

        [DisplayName("custom_variables"), Description("Variáveis Personalizadas")]
        public List<CustomVariable> CustomVariables { get; set; }

        public class CustomVariable
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        [DisplayName("early_payment_discount"), Description("Ativa ou não desconto por pagto antecipado")]
        public bool EarlyPaymentDiscount { get; set; }

        [DisplayName("early_payment_discounts"), Description("Quantidade de dias de antecedência para o pagamento receber o desconto")]
        public List<PaymentDiscounts> EarlyPaymentDiscounts { get; set; }

        public class PaymentDiscounts
        {
            [DisplayName("days"), Description("Número de dias para desconto.")]
            public int Days { get; set; }
            [DisplayName("percent"), Description("Valor do desconto em porcentagem. !value_cents")]
            public double Percent { get; set; }
            [DisplayName("value_cents"), Description("Valor do desconto em centavos. !percent")]
            public int ValueCents { get; set; }
        }

        [DisplayName("payer"), Description("Obrigatório para a emissão de boletos")]
        public ObjPayer Payer { get; set; }

        public class ObjPayer
        {
            [DisplayName("cpf_cnpj"), Description("CPF ou CNPJ do cliente (apenas números)")]
            public string CpfCnpj { get; set; }

            [DisplayName("name"), Description("Nome")]
            public string Name { get; set; }

            [DisplayName("phone_prefix"), Description("DDD")]
            public string PhonePrefix { get; set; }

            [DisplayName("phone"), Description("Telefone")]
            public string Phone { get; set; }

            [DisplayName("email"), Description("Email")]
            public string Email { get; set; }

            [DisplayName("address"), Description("Endereço")]
            public ObjPayerAddress Address { get; set; }

            public class ObjPayerAddress
            {
                [DisplayName("zip_code"), Description("CEP")]
                public string ZipCode { get; set; }

                [DisplayName("street"), Description("Rua")]
                public string Street { get; set; }

                [DisplayName("number"), Description("Número")]
                public string Number { get; set; }

                [DisplayName("district"), Description("Bairro")]
                public string District { get; set; }

                [DisplayName("city"), Description("Cidade")]
                public string City { get; set; }
                [DisplayName("state"), Description("UF")]
                public bool State { get; set; }


                [DisplayName("country"), Description("País")]
                public bool Country { get; set; }

                [DisplayName("complement"), Description("Complemento")]
                public bool Complement { get; set; }
            }
        }

        [DisplayName("order_id"), Description("Número único que identifica o pedido de compra.")]
        public string OrderId { get; set; }

        /*commissions*/

        [DisplayName("external_reference"), Description("Informação de referência externa,")]
        public string ExternalReference { get; set; }

        [DisplayName("max_installments_value"), Description("Limita um valor máximo de parcelas.")]
        public int MaxInstallmentsValue { get; set; }

        [DisplayName("splits"), Description("Lista de splits a serém aplicado nas faturas pagas.")]
        public List<Split> Splits { get; set; }
        public class Split
        {
            [DisplayName("recipient_account_id"), Description("ID Da conta que irá receber o split.")]
            public string RecipientAccountId { get; set; }

            [DisplayName("cents"), Description("//==> Centavos a serem cobrados da fatura")]
            public int Cents { get; set; }

            [DisplayName("percent"), Description("Porcentagem a ser cobrada da fatura")]
            public double Percent { get; set; }

            [DisplayName("bank_slip_cents"), Description("Valor em centavos a ser cobrado apenas em transações no boleto.")]
            public int BankSlipCents { get; set; }

            [DisplayName("bank_slip_percent"), Description("Valor em porcentagem a ser cobrado apenas em transações no boleto.")]
            public double BankSlipPercents { get; set; }

            [DisplayName("credit_card_cents"), Description("Valor em centavos a ser cobrado apenas em transações no cartão de crédito.")]
            public int CreditCardCents { get; set; }

            [DisplayName("credit_card_percent"), Description("Valor em porcentagem a ser cobrado apenas em transações no cartão de crédito.")]
            public int CreditCardPercent { get; set; }

            [DisplayName("pix_cents"), Description("Valor em centavos a ser cobrado apenas em transações no pix.")]
            public int PixCents { get; set; }

            [DisplayName("pix_percent"), Description("Valor em porcentagem a ser cobrado apenas em transações no pix")]
            public int PixPercent { get; set; }

            [DisplayName("permit_aggregated"), Description("Permite agregar comissionamento percentual + fixo")]
            public int PermitAggregated { get; set; }
        }
    }
}
