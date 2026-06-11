*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String

*** Keywords ***

Check Security Headers
    [Arguments]    ${response}
    ${headers}=    Set Variable    ${response.headers}
    Dictionary Should Contain Key    ${headers}    X-Content-Type-Options
    Dictionary Should Contain Key    ${headers}    X-Frame-Options
    Dictionary Should Contain Key    ${headers}    Strict-Transport-Security
    Dictionary Should Contain Key    ${headers}    Content-Security-Policy
    Dictionary Should Contain Key    ${headers}    Permissions-Policy
    Dictionary Should Contain Key    ${headers}    Referrer-Policy
    Dictionary Should Contain Key    ${headers}    X-XSS-Protection

Check HSTS Header
    [Arguments]    ${response}
    ${hsts}=    Get From Dictionary    ${response.headers}    Strict-Transport-Security
    Should Contain    ${hsts}    max-age=31536000
    Should Contain    ${hsts}    includeSubDomains

Check CSP Header
    [Arguments]    ${response}
    ${csp}=    Get From Dictionary    ${response.headers}    Content-Security-Policy
    Should Contain    ${csp}    default-src 'self'

Check No Sensitive Data Leaked
    [Arguments]    ${response}
    Should Not Contain    ${response.text}    password
    Should Not Contain    ${response.text}    secret
    Should Not Contain    ${response.text}    token
    Should Not Contain    ${response.text}    stack
    Should Not Contain    ${response.text}    trace

Check Rate Limit Headers
    [Arguments]    ${response}
    Dictionary Should Contain Key    ${response.headers}    X-RateLimit-Limit
    Dictionary Should Contain Key    ${response.headers}    X-RateLimit-Remaining
    Dictionary Should Contain Key    ${response.headers}    X-RateLimit-Reset

Validate Input Sanitization
    [Arguments]    ${input}
    Should Not Contain    ${input}    <
    Should Not Contain    ${input}    >
    Should Not Contain    ${input}    javascript:
    Should Not Contain    ${input}    on\w+=
