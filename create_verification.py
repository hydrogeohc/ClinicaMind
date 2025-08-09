import freestyle
import os

client = freestyle.Freestyle(os.environ["Uz6oWk4FDPzBJ4L4E5bvNS-DysWdQ1G8WNjBzj1YtDRNS86CTHq7PdWYWkfCRsiWTbe"])

verification_request = client.create_domain_verification_request(
    domain="clinical-mind.style.dev"
)

print("Verification code:", verification_request.verification_code)
print("Add this DNS record:")
print("Type: TXT")
print("Name: _freestyle_custom_hostname.clinical-mind.style.dev")
print("Value:", verification_request.verification_code)