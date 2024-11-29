FROM golang:latest

WORKDIR /backend

COPY . .

RUN go mod download

RUN go build -o /ordering-system

CMD [ "/ordering-system" ]

EXPOSE 8080