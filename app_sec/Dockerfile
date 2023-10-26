FROM python:3.8
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
COPY start.sh .
RUN chmod a+x start.sh
ENV JWT_SECRET_KEY='siouadeti23'
CMD ["./start.sh"]