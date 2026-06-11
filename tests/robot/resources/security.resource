*** Settings ***
Library    RequestsLibrary
Library    Collections
Resource    security_keywords.robot
Resource    api.resource

*** Keywords ***

Check All Security Headers
    [Arguments]    ${response}
    Check Security Headers    ${response}
    Check HSTS Header    ${response}
    Check CSP Header    ${response}

Test SQL Injection
    [Arguments]    ${url}    ${body}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    ${url}    json=${body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    500
    [Return]    ${response}

Test XSS Attack
    [Arguments]    ${url}    ${payload}
    ${response}=    GET On Session    api    ${url}${payload}    expected_status=any
    Should Not Contain    ${response.text}    <script>
    [Return]    ${response}

Test Rate Limiting
    [Arguments]    ${url}    ${body}    ${count}=100
    FOR    ${i}    IN RANGE    0    ${count}
        ${headers}=    Create Dictionary    Content-Type=application/json
        POST On Session    api    ${url}    json=${body}    headers=${headers}    expected_status=any
    END

Test Authentication Required
    [Arguments]    ${url}
    ${response}=    GET On Session    api    ${url}    expected_status=any
    Should Be Equal As Numbers    ${response.status_code}    401
    [Return]    ${response}

Test Input Validation
    [Arguments]    ${url}    ${invalid_body}
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${response}=    POST On Session    api    ${url}    json=${invalid_body}    headers=${headers}    expected_status=any
    Should Not Be Equal As Numbers    ${response.status_code}    200
    [Return]    ${response}
