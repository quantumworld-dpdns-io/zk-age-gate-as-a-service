*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Library    OperatingSystem

*** Keywords ***

Create API Session
    [Arguments]    ${alias}=api    ${url}=http://localhost:8787
    Create Session    ${alias}    ${url}

Get Request
    [Arguments]    ${alias}    ${url}    ${expected_status}=200
    ${response}=    GET On Session    ${alias}    ${url}    expected_status=${expected_status}
    [Return]    ${response}

Post Request
    [Arguments]    ${alias}    ${url}    ${json}=${None}    ${data}=${None}    ${headers}=${None}    ${expected_status}=200
    ${response}=    POST On Session    ${alias}    ${url}    json=${json}    data=${data}    headers=${headers}    expected_status=${expected_status}
    [Return]    ${response}

Options Request
    [Arguments]    ${alias}    ${url}    ${headers}=${None}    ${expected_status}=200
    ${response}=    OPTIONS On Session    ${alias}    ${url}    headers=${headers}    expected_status=${expected_status}
    [Return]    ${response}

Delete Request
    [Arguments]    ${alias}    ${url}    ${expected_status}=200
    ${response}=    DELETE On Session    ${alias}    ${url}    expected_status=${expected_status}
    [Return]    ${response}

Should Return JSON
    [Arguments]    ${response}
    Should Contain    ${response.headers}[Content-Type]    application/json

Should Have Security Headers
    [Arguments]    ${response}
    Dictionary Should Contain Key    ${response.headers}    X-Content-Type-Options
    Dictionary Should Contain Key    ${response.headers}    X-Frame-Options
    Dictionary Should Contain Key    ${response.headers}    Strict-Transport-Security
    Dictionary Should Contain Key    ${response.headers}    Content-Security-Policy
    Dictionary Should Contain Key    ${response.headers}    Permissions-Policy

Should Return Error
    [Arguments]    ${response}    ${status_code}=400
    Should Be Equal As Numbers    ${response.status_code}    ${status_code}
    Should Return JSON    ${response}
    ${json}=    Evaluate    json.loads($response.text)    json
    Dictionary Should Contain Key    ${json}    error
